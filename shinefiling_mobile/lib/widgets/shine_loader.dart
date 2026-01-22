import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

class ShineLoader extends StatelessWidget {
  final String text;
  final bool fullScreen;

  const ShineLoader({
    super.key, 
    this.text = 'Loading...', 
    this.fullScreen = true
  });

  @override
  Widget build(BuildContext context) {
    // Brand Colors
    const Color brandNavy = Color(0xFF0D1B21);
    const Color brandBronze = Color(0xFFC59D7F);

    Widget content = Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Animated Logo / Icon
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: brandBronze.withValues(alpha: 0.2),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Center(
            child: Text(
              'S',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: brandNavy,
              ),
            ),
          ),
        ).animate(onPlay: (controller) => controller.repeat(reverse: true))
         .scale(duration: 800.ms, begin: const Offset(1, 1), end: const Offset(1.1, 1.1))
         .shimmer(duration: 1200.ms, color: brandBronze.withValues(alpha: 0.3)),

        const SizedBox(height: 24),

        // Spinner
        const SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(
            color: brandBronze,
            strokeWidth: 2.5,
          ),
        ),

        const SizedBox(height: 16),

        // Text
        Text(
          text,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: brandNavy.withValues(alpha: 0.7),
            letterSpacing: 0.5,
          ),
        ).animate().fadeIn(duration: 600.ms),
      ],
    );

    if (fullScreen) {
      return Container(
        color: const Color(0xFFFDFBF7),
        child: Center(child: content),
      );
    }

    return Center(child: content);
  }
}
