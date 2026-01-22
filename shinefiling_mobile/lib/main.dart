import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:safe_device/safe_device.dart';
import 'package:screen_protector/screen_protector.dart';

// Page Imports
import 'pages/about_page.dart';
import 'pages/contact_page.dart';
import 'pages/home_page.dart'; // Import the new home page
import 'pages/login_page.dart';
import 'pages/signup_page.dart';
import 'pages/careers_page.dart';
import 'pages/splash_screen.dart';
import 'pages/kyc_page.dart';
import 'pages/kyc_page.dart';
import 'pages/admin/admin_dashboard_page.dart';
import 'pages/no_internet_page.dart';
import 'pages/employee/employee_dashboard_page.dart';
import 'pages/agent/agent_dashboard_page.dart';

import 'services/session_service.dart';

// Global Keys
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();

void main() {
  runApp(const ShineFilingApp());
}

class ShineFilingApp extends StatefulWidget {
  const ShineFilingApp({super.key});

  @override
  State<ShineFilingApp> createState() => _ShineFilingAppState();
}

class _ShineFilingAppState extends State<ShineFilingApp> {
  
  @override
  void initState() {
    super.initState();
    // Initialize Session Service with Navigator Key
    SessionService().initialize(navigatorKey);
  }

  @override
  void dispose() {
    SessionService().dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const Color brandNavy = Color(0xFF10232A);
    const Color brandBronze = Color(0xFFB58863);
    const Color webBg = Color(0xFFF2F1EF);

    return MaterialApp(
      navigatorKey: navigatorKey,
      title: 'ShineFiling',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        scaffoldBackgroundColor: webBg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: brandBronze,
          primary: brandNavy,
          secondary: brandBronze,
          surface: Colors.white,
        ),
      ),
      initialRoute: '/',
      navigatorObservers: <NavigatorObserver>[routeObserver, SessionService()],
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const SecurityGuard(child: LoginPage()),
        '/signup': (context) => const SecurityGuard(child: SignupPage()),
        '/home': (context) => const SecurityGuard(child: HomePage()),
        '/about': (context) => const AboutUsPage(),
        '/contact': (context) => const ContactUsPage(),
        '/careers': (context) => const CareersPage(),
        '/kyc': (context) => const SecurityGuard(child: KycPage()),
        '/admin': (context) => const SecurityGuard(child: AdminDashboardPage()),
        '/employee': (context) => const SecurityGuard(child: EmployeeDashboardPage()),
        '/agent': (context) => const SecurityGuard(child: AgentDashboardPage()),
      },
    );
  }
}

// --- SECURITY & NETWORK GUARD ---
class SecurityGuard extends StatefulWidget {
  final Widget child;
  const SecurityGuard({super.key, required this.child});

  @override
  State<SecurityGuard> createState() => _SecurityGuardState();
}

class _SecurityGuardState extends State<SecurityGuard> {
  bool _isRooted = false;
  bool _isChecking = true;
  bool _hasInternet = true;
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _checkSecurity();
    _initConnectivity();
  }

  Future<void> _checkSecurity() async {
    try {
      /* 
      // TEMPORARILY DISABLED FOR DEVELOPMENT
      
      // 1. Prevent Screenshots & Recording (Android/iOS)
      await ScreenProtector.protectDataLeakageOn();
      
      // 2. Check for Root/Jailbreak
      bool isJailBroken = await SafeDevice.isJailBroken;
      // 3. Check for Emulator
      bool isRealDevice = await SafeDevice.isRealDevice;
      // 4. Check for USB Debugging / Dev Mode
      bool isDevMode = await SafeDevice.isDevelopmentModeEnable;
      
      if (mounted) {
        setState(() {
          // Block if ANY security threat is found
          _isRooted = isJailBroken || !isRealDevice || isDevMode;
          _isChecking = false;
        });
      }
      */
      
      // Force pass for development
      if (mounted) setState(() { _isRooted = false; _isChecking = false; });
      
    } catch (e) {
      if (mounted) setState(() => _isChecking = false);
    }
  }

  Future<void> _initConnectivity() async {
    final connectivity = Connectivity();
    final result = await connectivity.checkConnectivity();
    _updateConnectionStatus(result);
    _connectivitySubscription = connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  void _updateConnectionStatus(List<ConnectivityResult> results) {
    setState(() {
      _hasInternet = !results.contains(ConnectivityResult.none);
    });
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isChecking) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_isRooted) {
      return const SecurityErrorScreen(
        title: 'Security Alert',
        message: 'Security Violation Detected.\n\nReasons could be:\n1. Rooted/Jailbroken Device\n2. Running on Emulator\n3. USB Debugging Enabled',
        icon: Icons.gpp_bad_rounded,
      );
    }

    if (!_hasInternet) {
      return NoInternetPage(onRetry: _initConnectivity);
    }

    return widget.child;
  }
}

class SecurityErrorScreen extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;

  const SecurityErrorScreen({super.key, required this.title, required this.message, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B21),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFFB58863), size: 64),
            const SizedBox(height: 24),
            Text(title, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(message, textAlign: TextAlign.center, style: const TextStyle(color: Colors.white70)),
            ),
          ],
        ),
      ),
    );
  }
}
