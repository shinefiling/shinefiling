import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter/services.dart';

class LockScreenPage extends StatefulWidget {
  const LockScreenPage({super.key});

  @override
  State<LockScreenPage> createState() => _LockScreenPageState();
}

class _LockScreenPageState extends State<LockScreenPage> {
  final LocalAuthentication auth = LocalAuthentication();
  bool _isAuthenticating = false;

  @override
  void initState() {
    super.initState();
    _authenticate();
  }

  Future<void> _authenticate() async {
    if (_isAuthenticating) return;
    setState(() => _isAuthenticating = true);

    try {
      bool canCheck = await auth.canCheckBiometrics || await auth.isDeviceSupported();
      
      if (!canCheck) {
        // Fallback if no biometrics? For now, we assume user keeps trying or kills app.
        // Or we could offer a simple PIN/Password fallback here.
        // For this task, we focus on Biometric unlock.
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biometrics not supported/enrolled.')));
        }
        setState(() => _isAuthenticating = false);
        return;
      }

      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Unlock ShineFiling to continue',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false, // Allow PIN/Pattern fallback offered by OS
        ),
      );

      if (didAuthenticate && mounted) {
        // Pop the lock screen
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      if (mounted) setState(() => _isAuthenticating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Prevent back button
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: const Color(0xFF0D1B21),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_rounded, color: Color(0xFFC59D7F), size: 64),
              const SizedBox(height: 24),
              Text(
                'ShineFiling Locked',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Session timed out due to inactivity.',
                style: GoogleFonts.plusJakartaSans(color: Colors.white70),
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                onPressed: _authenticate,
                icon: const Icon(Icons.fingerprint_rounded),
                label: const Text('Unlock App'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFC59D7F),
                  foregroundColor: const Color(0xFF0D1B21),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
