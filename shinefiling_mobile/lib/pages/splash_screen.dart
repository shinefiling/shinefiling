import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/loader_3d.dart';

// Destination Imports
import 'home_page.dart';
import 'login_page.dart';
import 'admin/admin_dashboard_page.dart';
import 'employee/employee_dashboard_page.dart';
import 'agent/agent_dashboard_page.dart';
import '../main.dart'; // For SecurityGuard

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  // Brand Colors
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  static const Color brightGold = Color(0xFFFFD700);
  static const Color cyanGlow = Color(0xFF00FFFF);

  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
    _checkSession();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _checkSession() async {
    // Artificial delay for animation
    await Future.delayed(const Duration(seconds: 3));

    if (!mounted) return;

    final prefs = await SharedPreferences.getInstance();
    if (!mounted) return;
    
    final token = prefs.getString('token');
    final role = prefs.getString('role');

    Widget destination;
    // Determine Destination
    if (token != null && token.isNotEmpty) {
      final roleStr = (role ?? 'USER').toString().toUpperCase();

      if (roleStr.contains('ADMIN') || roleStr.contains('MASTER')) {
        destination = const SecurityGuard(child: AdminDashboardPage());
      } else if (roleStr == 'EMPLOYEE') {
        destination = const SecurityGuard(child: EmployeeDashboardPage());
      } else if (roleStr == 'AGENT') {
        destination = const SecurityGuard(child: AgentDashboardPage());
      } else {
        destination = const SecurityGuard(child: HomePage());
      }
    } else {
      destination = const SecurityGuard(child: LoginPage());
    }

    // Custom 3D Transition
    Navigator.of(context).pushReplacement(_create3DRoute(destination));
  }

  Route _create3DRoute(Widget page) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        // CURVES
        const curve = Curves.easeOutCubic;
        var curvedAnimation = CurvedAnimation(parent: animation, curve: curve);
        var reverseCurve = CurvedAnimation(parent: secondaryAnimation, curve: curve);

        // TRANSITIONS
        // 1. Scale: New page grows from 0.9 to 1.0 (Subtle Zoom In)
        var scaleIn = Tween<double>(begin: 0.92, end: 1.0).animate(curvedAnimation);
        
        // 2. Fade: New page fades in
        var fadeIn = Tween<double>(begin: 0.0, end: 1.0).animate(curvedAnimation);

        return FadeTransition(
          opacity: fadeIn,
          child: ScaleTransition(
            scale: scaleIn,
            child: child,
          ),
        );
      },
      transitionDuration: const Duration(milliseconds: 800),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: brandNavy,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 0. Top Spotlight (Cinematic Lighting)
          Positioned(
            top: -150,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                width: 400,
                height: 400,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [brandBronze.withValues(alpha: 0.2), Colors.transparent],
                    stops: const [0.0, 0.7],
                  ),
                ),
              ),
            ),
          ).animate().fadeIn(duration: 1.seconds),

          // 1. Floating Gold Particles
          ...List.generate(8, (index) => _buildFloatingIcon(index)),

          // 2. Central 3D Composition
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildComposer3DLogo(), // The Shield & Document
                const SizedBox(height: 50),
                _buildTitleText(),
                const SizedBox(height: 12),
                _buildTagline(),
                const SizedBox(height: 60),
                _buildProgressBar(),
              ],
            ),
          ),

          // 3. Footer
          Positioned(
            bottom: 40,
            left: 0, 
            right: 0,
            child: Center(
              child: Text(
                'Powered by Intelligent Legal',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  color: Colors.white24,
                  letterSpacing: 2,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ).animate().fadeIn(delay: 2.seconds),
        ],
      ),
    );
  }

  Widget _buildComposer3DLogo() {
    return SizedBox(
      width: 220,
      height: 220,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 0. Ambient Glow
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                 BoxShadow(color: brandBronze.withValues(alpha: 0.2), blurRadius: 80, spreadRadius: 20),
              ]
            ),
          ),

          // 1. Rotating Orbital Rings (The "Animation Design")
          const OrbitalRings(),

          // 2. Main Shield (Scale Breathing)
          ScaleTransition(
            scale: Tween<double>(begin: 0.95, end: 1.05).animate(
              CurvedAnimation(parent: _controller, curve: Curves.easeInOutSine)
            ),
            child: ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Color(0xFF8B6B4E), brandBronze, brightGold, brandBronze],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ).createShader(bounds),
              child: const Icon(
                Icons.shield_rounded, 
                size: 100, 
                color: Colors.white,
              ),
            ),
          ),

          // 3. Floating Document (Parallax)
          Positioned(
            right: 60,
            bottom: 60,
            child: Container(
               decoration: BoxDecoration(
                 shape: BoxShape.circle,
                 boxShadow: [
                   BoxShadow(color: cyanGlow.withValues(alpha: 0.2), blurRadius: 20, spreadRadius: -5),
                 ]
               ),
               child: Icon(
                 Icons.verified_user_rounded, 
                 size: 60, 
                 color: Colors.white.withValues(alpha: 0.9),
               ).animate().slide(begin: const Offset(0, 0.05), duration: 2.seconds, curve: Curves.easeInOut),
            ),
          ),
          
          // 4. Scanner Effect (Light Sweep)
          Positioned.fill(
             child: ClipOval(
                child: const ScannerLine().animate(onPlay: (c) => c.repeat()).moveY(begin: -220, end: 220, duration: 3.seconds, curve: Curves.easeInOut),
             ),
          ),
        ],
      ),
    );
  }
  Widget _buildTitleText() {
    return Column(
      children: [
        ShaderMask(
          shaderCallback: (bounds) => const LinearGradient(
            colors: [Colors.white, Color(0xFFE0E0E0)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ).createShader(bounds),
          child: Text(
            'ShineFiling',
            style: GoogleFonts.outfit(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: -1.5,
              shadows: [
                 BoxShadow(color: brandBronze.withValues(alpha: 0.5), blurRadius: 20, offset: const Offset(0, 5))
              ]
            ),
          ),
        ).animate()
         .slideY(begin: 0.3, end: 0, duration: 800.ms, curve: Curves.easeOut)
         .fadeIn(duration: 800.ms),
      ],
    );
  }

  Widget _buildTagline() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: brandBronze.withValues(alpha: 0.2)),
      ),
      child: Text(
        'BUSINESS COMPLIANCE SIMPLIFIED',
        style: GoogleFonts.plusJakartaSans(
          fontSize: 10,
          color: brandBronze,
          fontWeight: FontWeight.w700,
          letterSpacing: 2,
        ),
      ),
    ).animate().fadeIn(delay: 600.ms).scale(curve: Curves.easeOutBack);
  }

  Widget _buildProgressBar() {
    return SizedBox(
      width: 140,
      height: 3,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(2),
        child: LinearProgressIndicator(
          backgroundColor: Colors.white.withValues(alpha: 0.05),
          valueColor: const AlwaysStoppedAnimation<Color>(brandBronze),
        ),
      ),
    ).animate().fadeIn(delay: 1.seconds);
  }

  Widget _buildFloatingIcon(int index) {
    // Icons representing Law, Finance, Security
    final icons = [Icons.gavel, Icons.description, Icons.shield, Icons.account_balance, Icons.analytics, Icons.verified];
    
    // Distribute randomly
    final randomX = (index * 50.0) % 300 - 150; // -150 to 150
    final randomY = (index * 60.0) % 600 - 300; 

    return Center(
      child: Transform.translate(
        offset: Offset(randomX, randomY),
        child: Icon(
          icons[index % icons.length],
          color: brandBronze.withValues(alpha: 0.05), // Subtle gold dust
          size: 20 + (index % 3) * 10.0,
        ),
      ),
    ).animate(
      onPlay: (controller) => controller.repeat(reverse: true),
    ).scale(
      begin: const Offset(1,1), end: const Offset(1.2, 1.2),
      duration: Duration(seconds: 2 + index),
    ).fadeIn(duration: 1.seconds);
  }
}

// --- VISUAL COMPONENTS ---

class OrbitalRings extends StatefulWidget {
  const OrbitalRings({super.key});

  @override
  State<OrbitalRings> createState() => _OrbitalRingsState();
}

class _OrbitalRingsState extends State<OrbitalRings> with SingleTickerProviderStateMixin {
  late AnimationController _ac;

  @override
  void initState() {
    super.initState();
    _ac = AnimationController(vsync: this, duration: const Duration(seconds: 10))..repeat();
  }

  @override
  void dispose() {
    _ac.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ac,
      builder: (context, child) {
        return CustomPaint(
          size: const Size(220, 220),
          painter: RingPainter(progress: _ac.value),
        );
      },
    );
  }
}

class RingPainter extends CustomPainter {
  final double progress;
  RingPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Ring 1 (Gold)
    paint.color = const Color(0xFFC59D7F).withValues(alpha: 0.3);
    paint.strokeWidth = 1.5;
    var rect1 = Rect.fromCircle(center: center, radius: 80);
    // Draw arcs instead of full circles for "tech" look
    canvas.drawArc(rect1, progress * 6.28, 1.5, false, paint);
    canvas.drawArc(rect1, progress * 6.28 + 2.5, 1.5, false, paint);

    // Ring 2 (Cyan Thin)
    paint.color = const Color(0xFF00FFFF).withValues(alpha: 0.2);
    paint.strokeWidth = 1;
    var rect2 = Rect.fromCircle(center: center, radius: 95);
    canvas.drawArc(rect2, -progress * 6.28, 2.0, false, paint);
    canvas.drawArc(rect2, -progress * 6.28 + 3.5, 1.0, false, paint);
    
    // Ring 3 (Outer Particles)
    paint.style = PaintingStyle.fill;
    paint.color = Colors.white.withValues(alpha: 0.4);
    for (int i = 0; i < 4; i++) {
       double angle = (progress * 6.28) + (i * (3.14 / 2));
       double r = 105;
       canvas.drawCircle(
         Offset(center.dx + r * 1.5 * (0.5 + 0.5 * angle.abs() % 1), center.dy + r * 1.5 * (0.5 + 0.5 * angle.abs() % 1)), // Just noise movement
         2, paint
       );
    }
  }

  @override
  bool shouldRepaint(covariant RingPainter oldDelegate) => true;
}

class ScannerLine extends StatelessWidget {
  const ScannerLine({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.transparent,
            Colors.white.withValues(alpha: 0.1),
            Colors.white.withValues(alpha: 0.0),
          ],
          stops: const [0.0, 0.5, 1.0]
        ),
      ),
    );
  }
}
