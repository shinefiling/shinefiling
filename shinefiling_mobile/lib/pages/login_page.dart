import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'signup_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with SingleTickerProviderStateMixin {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  static const Color accentGold = Color(0xFFD4AF37);
  
  bool _obscureText = true;
  bool _isLoading = false;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;
  
  final LocalAuthentication auth = LocalAuthentication();
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();
  bool _canCheckBiometrics = false;

  @override
  void initState() {
    super.initState();
    _checkBiometrics();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _checkBiometrics() async {
    // Check if device supports it AND if user enabled it in Profile
    bool isDeviceSupported = false;
    try {
      isDeviceSupported = await auth.canCheckBiometrics && await auth.isDeviceSupported();
    } catch (e) {
      // ignore
    }

    final prefs = await SharedPreferences.getInstance();
    bool isEnabledByUser = prefs.getBool('biometrics_enabled') ?? false;

    if (!mounted) return;
    setState(() => _canCheckBiometrics = isDeviceSupported && isEnabledByUser);
    
    // Auto-trigger if enabled
    if (_canCheckBiometrics) {
       // Auto-prompt on start
       _handleBiometricLogin(); 
    }
  }

  Future<void> _handleBiometricLogin() async {
    try {
      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Authenticate to access your account',
        options: const AuthenticationOptions(biometricOnly: true),
      );

      if (didAuthenticate && mounted) {
         setState(() => _isLoading = true);
         
         // Retrieve credentials
         final email = await secureStorage.read(key: 'user_email');
         final password = await secureStorage.read(key: 'user_password');

         if (email != null && password != null && email.isNotEmpty && password.isNotEmpty) {
           // Auto-fill and Login
           _emailController.text = email;
           _passwordController.text = password;
           await _handleLogin(isBiometric: true);
         } else {
           setState(() => _isLoading = false);
           ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(content: Text('No credentials saved. Please login manually once.'), backgroundColor: Colors.orange)
           );
         }
      }
    } catch (e) {
       setState(() => _isLoading = false);
       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Biometric Error: $e'), backgroundColor: Colors.red));
    }
  }

  Widget _buildBiometricLogin() {
    return Center(
      child: IconButton(
        iconSize: 52,
        onPressed: _handleBiometricLogin,
        icon: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
             color: Colors.white,
             shape: BoxShape.circle,
             border: Border.all(color: brandBronze.withValues(alpha: 0.5), width: 1.5),
             boxShadow: [
               BoxShadow(color: brandNavy.withValues(alpha: 0.1), blurRadius: 15, offset: const Offset(0, 5))
             ]
          ),
          child: const Icon(Icons.fingerprint_rounded, color: brandNavy, size: 36),
        ),
      ),
    ).animate().scale(duration: 400.ms, curve: Curves.easeOutBack);
  }

  Future<void> _handleLogin({bool isBiometric = false}) async {
    if (!isBiometric) setState(() => _isLoading = true);
    
    try {
      final response = await ApiService().login(
        _emailController.text,
        _passwordController.text,
      );
      
      if (mounted) {
        setState(() => _isLoading = false);
        if (response['success'] == true) {
          final user = response['user'];
          final role = user['role'] ?? 'USER';
          final token = response['token'] ?? 'SESSION_TOKEN';

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', token);
          await prefs.setString('role', role);
          if (user['id'] != null) await prefs.setString('userId', user['id'].toString());
          
          // Securely Save Credentials for Biometric Next Time
          await secureStorage.write(key: 'user_email', value: _emailController.text);
          await secureStorage.write(key: 'user_password', value: _passwordController.text);

          final roleStr = (role ?? 'USER').toString().toUpperCase();
          
          if (['MASTER_ADMIN', 'ADMIN'].contains(roleStr)) {
             Navigator.pushReplacementNamed(context, '/admin');
          } else if (roleStr == 'EMPLOYEE') {
             Navigator.pushReplacementNamed(context, '/employee');
          } else if (roleStr == 'AGENT') {
             Navigator.pushReplacementNamed(context, '/agent');
          } else {
             Navigator.pushReplacementNamed(context, '/home');
          }
        } else {
          // Check if it's a network error or credential error
          String msg = response['message'] ?? 'Unknown Error';
          if (msg.contains('Network error') || msg.contains('Connection refused')) {
             _showErrorDialog(
               'Connection Error', 
               'Unable to connect to the server. Please check your internet connection or try again after some time.'
             );
          } else {
             _showErrorDialog(
               'Authentication Failed', 
               'Invalid User ID or Password. Please check your credentials and try again.'
             );
          }
        }
      }
    } catch (e) {
       if (mounted) {
        setState(() => _isLoading = false);
        _showErrorDialog('System Error', 'An unexpected error occurred: $e');
       }
    }
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy)),
        content: Text(message, style: GoogleFonts.plusJakartaSans(fontSize: 14)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('OK', style: GoogleFonts.plusJakartaSans(color: brandBronze, fontWeight: FontWeight.bold)),
          )
        ],
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Background Gradient Blobs
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: brandBronze.withValues(alpha: 0.05),
              ),
            ),
          ),
          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 60),
                        _buildBrandLogo(),
                        const SizedBox(height: 60),
                        _buildWelcomeText(),
                        const SizedBox(height: 50),
                        _buildEmailField(),
                        const SizedBox(height: 24),
                        _buildPasswordField(),
                        const SizedBox(height: 16),
                        _buildForgotPassword(),
                        const SizedBox(height: 40),
                        _buildLoginButton(),
                        const SizedBox(height: 24),
                        if (_canCheckBiometrics)
                          _buildBiometricLogin(),
                        const SizedBox(height: 24),
                        _buildDivider(),
                        const SizedBox(height: 32),
                        _buildSocialButtons(),
                        const SizedBox(height: 40),
                        _buildSignupPrompt(),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ).animate().fadeIn(duration: 800.ms),
        ],
      ),
    );
  }

  Widget _buildBrandLogo() {
    return Row(
      children: [
        Container(
          width: 4,
          height: 40,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [accentGold, brandBronze],
            ),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'ShineFiling',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: brandNavy,
                letterSpacing: -0.5,
              ),
            ),
            Text(
              'Business Compliance',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: brandBronze,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildWelcomeText() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Welcome Back',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 38,
            fontWeight: FontWeight.w900,
            color: brandNavy,
            letterSpacing: -2,
            height: 1.1,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Continue your business journey with us',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 16,
            color: brandNavy.withValues(alpha: 0.45),
            fontWeight: FontWeight.w500,
            height: 1.5,
            letterSpacing: 0.2,
          ),
        ),
      ],
    );
  }

  Widget _buildEmailField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'EMAIL ADDRESS',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: brandNavy.withValues(alpha: 0.3),
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: brandNavy.withValues(alpha: 0.08)),
            boxShadow: [
              BoxShadow(
                color: brandNavy.withValues(alpha: 0.02),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: brandNavy,
            ),
            decoration: InputDecoration(
              hintText: 'name@business.com',
              hintStyle: GoogleFonts.plusJakartaSans(
                color: brandNavy.withValues(alpha: 0.2),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
              prefixIcon: Container(
                padding: const EdgeInsets.all(12),
                child: Icon(
                  Icons.alternate_email_rounded,
                  color: brandBronze,
                  size: 20,
                ),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'PASSWORD',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: brandNavy.withValues(alpha: 0.3),
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: brandNavy.withValues(alpha: 0.08)),
            boxShadow: [
              BoxShadow(
                color: brandNavy.withValues(alpha: 0.02),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: TextField(
            controller: _passwordController,
            obscureText: _obscureText,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: brandNavy,
            ),
            decoration: InputDecoration(
              hintText: '••••••••',
              hintStyle: GoogleFonts.plusJakartaSans(
                color: brandNavy.withValues(alpha: 0.2),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
              prefixIcon: Container(
                padding: const EdgeInsets.all(12),
                child: Icon(
                  Icons.lock_person_rounded,
                  color: brandBronze,
                  size: 20,
                ),
              ),
              suffixIcon: IconButton(
                icon: Icon(
                   _obscureText ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                   color: brandNavy.withValues(alpha: 0.25),
                   size: 20,
                ),
                onPressed: () => setState(() => _obscureText = !_obscureText),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildForgotPassword() {
    return Align(
      alignment: Alignment.centerRight,
      child: TextButton(
        onPressed: () {},
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: const Size(0, 0),
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
        child: Text(
          'Forgot password?',
          style: GoogleFonts.plusJakartaSans(
            color: brandBronze,
            fontWeight: FontWeight.w700,
            fontSize: 14,
            letterSpacing: 0.2,
          ),
        ),
      ),
    );
  }

  Widget _buildLoginButton() {
    return Container(
      width: double.infinity,
      height: 58,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [brandNavy, const Color(0xFF1A2F38)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: brandNavy.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: _isLoading ? null : _handleLogin,
          borderRadius: BorderRadius.circular(12),
          child: Center(
            child: _isLoading
                ? const SizedBox(
                    height: 24,
                    width: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    'Sign In',
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                    ),
                  ),
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 1,
            color: brandNavy.withValues(alpha: 0.08),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'OR',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: brandNavy.withValues(alpha: 0.3),
              letterSpacing: 2,
            ),
          ),
        ),
        Expanded(
          child: Container(
            height: 1,
            color: brandNavy.withValues(alpha: 0.08),
          ),
        ),
      ],
    );
  }

  Widget _buildSocialButtons() {
    return Row(
      children: [
        Expanded(
          child: _buildSocialButton(
            'Google',
            Icons.g_mobiledata_rounded,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildSocialButton(
            'Apple',
            Icons.apple_rounded,
          ),
        ),
      ],
    );
  }

  Widget _buildSocialButton(String name, IconData icon) {
    return Container(
      height: 54,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: brandNavy.withValues(alpha: 0.1),
          width: 1.5,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 26, color: brandNavy.withValues(alpha: 0.8)),
              const SizedBox(width: 10),
              Text(
                name,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: brandNavy.withValues(alpha: 0.8),
                  letterSpacing: 0.3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSignupPrompt() {
    return Center(
      child: GestureDetector(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const SignupPage()),
        ),
        child: RichText(
          text: TextSpan(
            text: "Don't have an account? ",
            style: GoogleFonts.plusJakartaSans(
              color: brandNavy.withValues(alpha: 0.5),
              fontSize: 15,
              fontWeight: FontWeight.w500,
              letterSpacing: 0.2,
            ),
            children: [
              TextSpan(
                text: "Sign Up",
                style: GoogleFonts.plusJakartaSans(
                  color: brandBronze,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
