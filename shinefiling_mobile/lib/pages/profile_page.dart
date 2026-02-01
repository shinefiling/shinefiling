import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';
import 'notifications_page.dart';
import 'payments_page.dart';
import 'support_page.dart';
import 'about_page.dart';
import 'contact_page.dart';
import 'careers_page.dart';
import 'login_page.dart';
import 'legal_page.dart';
import 'kyc_page.dart';
import 'smart_vault_page.dart';
import 'change_password_page.dart';
import 'edit_profile_page.dart';
import '../widgets/loader_3d.dart';

class ProfilePage extends StatefulWidget {
  final Map<String, dynamic>? initialProfile;
  const ProfilePage({super.key, this.initialProfile});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  bool _isLoggingOut = false;
  String _userName = 'User';
  String _userEmail = 'user@example.com';

  bool _isKycVerified = false;
  String _profileImage = '';
  bool _isLoading = true;

  bool _biometricsEnabled = false;
  final LocalAuthentication auth = LocalAuthentication();
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    if (widget.initialProfile != null) {
      final p = widget.initialProfile!;
      _userName = p['fullName'] ?? 'User';
      _userEmail = p['email'] ?? 'user@example.com';
      _isKycVerified = p['isKycVerified'] ?? false;
      _profileImage = p['profileImage'] ?? '';
      _isLoading = false;
    } else {
      _loadUserData();
    }
    _loadBiometricStatus();
  }

  Future<void> _loadBiometricStatus() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _biometricsEnabled = prefs.getBool('biometrics_enabled') ?? false;
    });
  }

  Future<void> _toggleBiometrics(bool value) async {
    if (value) {
      // Enabling
      bool canCheck = false;
      try {
        canCheck = await auth.canCheckBiometrics && await auth.isDeviceSupported();
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error checking biometrics: $e'), backgroundColor: Colors.red));
        return;
      }

      if (!canCheck) {
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(
               content: Text('Biometrics not available on this device. Please check your device settings.'),
               backgroundColor: Colors.orange
             )
           );
        }
        return;
      }

      try {
        final bool didAuthenticate = await auth.authenticate(
          localizedReason: 'Authenticate to enable Biometric Login',
          options: const AuthenticationOptions(
            biometricOnly: true, 
            stickyAuth: true,
          ),
        );
        
        if (didAuthenticate) {
           final prefs = await SharedPreferences.getInstance();
           await prefs.setBool('biometrics_enabled', true);
           setState(() => _biometricsEnabled = true);
           if (mounted) {
             ScaffoldMessenger.of(context).showSnackBar(
               const SnackBar(content: Text('Biometric Login Enabled'), backgroundColor: Colors.green)
             );
           }
        } else {
           if (mounted) {
             ScaffoldMessenger.of(context).showSnackBar(
               const SnackBar(content: Text('Authentication canceled or failed'), backgroundColor: Colors.grey)
             );
             // Ensure switch logic stays off
             setState(() => _biometricsEnabled = false);
           }
        }
      } catch (e) {
         if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
             SnackBar(content: Text('Authentication Error: $e'), backgroundColor: Colors.red)
           );
           setState(() => _biometricsEnabled = false);
         }
      }
    } else {
      // Disabling
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('biometrics_enabled', false);
      setState(() => _biometricsEnabled = false);
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(
           const SnackBar(content: Text('Biometric Login Disabled'), backgroundColor: Colors.grey)
         );
      }
    }
  }

  Widget _buildSwitchTile(IconData icon, String title, String subtitle, bool value, Function(bool) onChanged) {
    return SwitchListTile(
      value: value,
      onChanged: onChanged,
      activeColor: brandBronze,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      secondary: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: brandNavy.withValues(alpha: 0.04), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: brandNavy, size: 22),
      ),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 15, color: brandNavy)),
      subtitle: Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500)),
    );
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Load local first
    final localName = prefs.getString('user_name');
    if (localName != null) {
      if (mounted) {
        setState(() {
          _userName = localName;
          _userEmail = prefs.getString('user_email') ?? 'user@example.com';
          _isLoading = false; // Show content immediately if cached
        });
      }
    }

    // Fetch fresh from API
    try {
      final profile = await ApiService().getUserProfile();
      if (profile.isNotEmpty && mounted) {
        setState(() {
          _userName = profile['fullName'] ?? _userName;
          _userEmail = profile['email'] ?? _userEmail;
          _isKycVerified = profile['isKycVerified'] ?? false;
          _profileImage = profile['profileImage'] ?? '';
          _isLoading = false;
          
          // Update Prefs
          prefs.setString('user_name', _userName);
          prefs.setString('user_email', _userEmail);
        });
      } else if (mounted) {
         // Fallback if API returns empty but no error
         setState(() {
            _userName = 'User';
            _profileImage = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            _isLoading = false;
         });
      }
    } catch (e) {
      if (mounted) {
         // Fallback on Error
         setState(() {
           _isLoading = false;
           // Keep local if available, else defaults
           if (_userName == 'User') {
              _profileImage = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
           }
         });
      }
    }
  }



  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF0F2F5),
        body: Center(
          child: Loader3D(size: 45, text: "Loading Profile..."),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      body: RefreshIndicator(
        onRefresh: _loadUserData,
        color: brandBronze,
        backgroundColor: Colors.white,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(), // Important for RefreshIndicator in SingleChild
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 32),
                  _buildProfileCard(),
                  const SizedBox(height: 32),
                  _buildMenuSection('Account Settings', [
                    _buildMenuTile(Icons.folder_copy_rounded, 'Document Wallet', 'Manage your files', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const SmartVaultPage()));
                    }),
                    _buildMenuTile(Icons.person_outline_rounded, 'Personal Information', 'Name, Contact, Address', () async {
                      final result = await Navigator.push(
                        context, 
                        MaterialPageRoute(builder: (context) => const EditProfilePage())
                      );
                      if (result == true) {
                        _loadUserData();
                      }
                    }),
                    _buildMenuTile(Icons.notifications_none_rounded, 'Notifications', 'Manage your alerts', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationsPage()));
                    }),
                    _buildMenuTile(Icons.payment_rounded, 'Payments & Invoices', 'Transaction history', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const PaymentsPage()));
                    }),
                  ]),
                  const SizedBox(height: 24),
                  _buildMenuSection('Security', [
                    _buildSwitchTile(
                      Icons.fingerprint_rounded, 
                      'Biometric Login', 
                      _biometricsEnabled ? 'Enabled' : 'Disabled', 
                      _biometricsEnabled, 
                      _toggleBiometrics
                    ),
                    _buildMenuTile(Icons.security_rounded, 'Security & Password', '2FA, Change password', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const ChangePasswordPage()));
                    }),
                    _buildMenuTile(Icons.privacy_tip_outlined, 'KYC Verification', _isKycVerified ? 'Status: Verified' : 'Status: Pending', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const KycPage()));
                    }, trailing: _isKycVerified ? _buildVerifiedBadge() : const Icon(Icons.chevron_right, color: Colors.grey)),
                  ]),
                  const SizedBox(height: 24),
                  _buildMenuSection('Support', [
                    _buildMenuTile(Icons.help_outline_rounded, 'Help & Support', 'Chat with experts', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const SupportPage()));
                    }),
                    _buildMenuTile(Icons.info_outline_rounded, 'About ShineFiling', 'App version & mission', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const AboutUsPage()));
                    }),
                    _buildMenuTile(Icons.work_outline_rounded, 'Careers', 'Join our team', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const CareersPage()));
                    }),
                    _buildMenuTile(Icons.contact_support_outlined, 'Contact Us', 'Our offices & email', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const ContactUsPage()));
                    }),
                  ]),
                  const SizedBox(height: 24),
                  _buildMenuSection('Legal', [
                    _buildMenuTile(Icons.description_outlined, 'Terms & Conditions', 'Usage agreements', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const LegalPage(title: 'Terms of Service', content: LegalPage.termsText)));
                    }),
                    _buildMenuTile(Icons.privacy_tip_outlined, 'Privacy Policy', 'Data protection', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const LegalPage(title: 'Privacy Policy', content: LegalPage.privacyPolicyText)));
                    }),
                  ]),
                  const SizedBox(height: 32),
                  _buildLogoutButton(context),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Text(
      'Account',
      style: GoogleFonts.plusJakartaSans(fontSize: 28, fontWeight: FontWeight.w900, color: brandNavy),
    );
  }

  Widget _buildProfileCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 20, offset: const Offset(0, 10))
        ],
      ),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: brandBronze.withValues(alpha: 0.1), width: 4),
                  image: DecorationImage(
                    image: NetworkImage(
                      (_profileImage.isNotEmpty && !_profileImage.contains('localhost')) 
                        ? _profileImage 
                        : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    ),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(color: brandNavy, shape: BoxShape.circle),
                child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 14),
              ),
            ],
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _userName,
                  style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: brandNavy),
                ),
                Text(
                  _userEmail,
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, color: brandNavy.withValues(alpha: 0.4), fontWeight: FontWeight.w600),
                ),
                if (_isKycVerified) ...[
                  const SizedBox(height: 8),
                  _buildVerifiedBadge(),
                ]
              ],
            ),
          ),
        ],
      ),
    );
  }



  Widget _buildMenuSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            title.toUpperCase(),
            style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandNavy.withValues(alpha: 0.3), letterSpacing: 1.5),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: brandNavy.withValues(alpha: 0.02), blurRadius: 15, offset: const Offset(0, 5))
            ],
          ),
          child: Column(children: items),
        ),
      ],
    );
  }

  Widget _buildMenuTile(IconData icon, String title, String subtitle, VoidCallback onTap, {Widget? trailing}) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: brandNavy.withValues(alpha: 0.04), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: brandNavy, size: 22),
      ),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 15, color: brandNavy)),
      subtitle: Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500)),
      trailing: trailing ?? Icon(Icons.chevron_right_rounded, color: brandNavy.withValues(alpha: 0.2)),
    );
  }

  Widget _buildVerifiedBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.verified_user_rounded, color: Colors.green, size: 10),
          const SizedBox(width: 4),
          Text(
            'KYC VERIFIED',
            style: GoogleFonts.plusJakartaSans(color: Colors.green, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 0.5),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: TextButton.icon(
        onPressed: _isLoggingOut ? null : () async {
          setState(() => _isLoggingOut = true);
          
          await ApiService().logout();
          
          if (mounted) {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const LoginPage()),
              (route) => false,
            );
          }
        },
        icon: _isLoggingOut 
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.redAccent),
              ),
            )
          : const Icon(Icons.logout_rounded, color: Colors.redAccent, size: 20),
        label: Text(
          _isLoggingOut ? 'Signing Out...' : 'Sign Out Account',
          style: GoogleFonts.plusJakartaSans(
            color: _isLoggingOut ? Colors.redAccent.withValues(alpha: 0.5) : Colors.redAccent,
            fontWeight: FontWeight.bold,
          ),
        ),
        style: TextButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.redAccent.withValues(alpha: 0.1)),
          ),
        ),
      ),
    );
  }


}
