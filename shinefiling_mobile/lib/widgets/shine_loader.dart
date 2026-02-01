import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ShineLoader extends StatefulWidget {
  final String text;
  final bool fullScreen;
  final double size;

  const ShineLoader({
    super.key,
    this.text = "LOADING...",
    this.fullScreen = true,
    this.size = 60,
  });

  @override
  State<ShineLoader> createState() => _ShineLoaderState();
}

class _ShineLoaderState extends State<ShineLoader> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _spinController;
  late AnimationController _counterSpinController;

  // Exact colors from Web implementation
  static const Color colorNavy = Color(0xFF0B1221);
  static const Color colorBronze = Color(0xFFB58863);
  static const Color colorSlate = Color(0xFF94A3B8);

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat(reverse: true);
    _spinController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat();
    _counterSpinController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _spinController.dispose();
    _counterSpinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double baseSize = widget.size;

    Widget coreLoader = Stack(
      alignment: Alignment.center,
      children: [
        // Ambient Glow (Bronze/10 blur-[60px])
        Container(
          width: baseSize * 2,
          height: baseSize * 2,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: colorBronze.withOpacity(0.1),
            boxShadow: [
              BoxShadow(
                color: colorBronze.withOpacity(0.15),
                blurRadius: 60,
                spreadRadius: 20,
              ),
            ],
          ),
        ),

        // Outer Ring (Static/Subtle Pulse) - White/5
        AnimatedBuilder(
          animation: _pulseController,
          builder: (context, child) {
            return Transform.scale(
              scale: 1.0 + (_pulseController.value * 0.05), // [1, 1.05]
              child: Opacity(
                opacity: 0.1 + (_pulseController.value * 0.1), // [0.1, 0.2]
                child: Container(
                  width: baseSize * 2.8,
                  height: baseSize * 2.8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
                  ),
                ),
              ),
            );
          },
        ),

        // Primary Spinning Arc (Gold)
        AnimatedBuilder(
          animation: _spinController,
          builder: (context, child) {
            return Transform.rotate(
              angle: _spinController.value * 2 * math.pi,
              child: SizedBox(
                width: baseSize * 2.2,
                height: baseSize * 2.2,
                child: CustomPaint(
                  // Web: border-t-bronze border-r-bronze (Top and Right) = 180 degrees approx?
                  // Actually border-t and border-r on a circle creates a generic arc from -45 to 135 deg visually if rotated 45deg.
                  // Let's just draw two 90 degree arcs or one continuous 180 degree arc. 
                  // Visual: Top-Right quadrant (+ more?)
                  // Let's go with a 90 degree arc for cleaner look or 120.
                  painter: ArcPainter(
                    color: colorBronze, 
                    width: 3, 
                    sweepAngle: math.pi / 2, // 90 degrees
                    startAngle: -math.pi / 2 // Start from top
                  ),
                ),
              ),
            );
          },
        ),
        
        // Secondary Counter-Spinning Arc (Silver)
        AnimatedBuilder(
          animation: _counterSpinController,
          builder: (context, child) {
            return Transform.rotate(
              angle: -_counterSpinController.value * 2 * math.pi,
              child: SizedBox(
                width: baseSize * 1.6,
                height: baseSize * 1.6,
                child: CustomPaint(
                  // Web: border-b-slate border-l-slate
                  painter: ArcPainter(
                    color: colorSlate.withOpacity(0.4), // slightly more visible
                    width: 2, 
                    sweepAngle: math.pi / 2, 
                    startAngle: math.pi / 2 // Start from bottom
                  ),
                ),
              ),
            );
          },
        ),

        // Central Static Logo Container
        Container(
          width: baseSize,
          height: baseSize,
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: colorBronze.withOpacity(0.2), 
                blurRadius: 20, 
                offset: Offset(0, 4)
              )
            ]
          ),
          child: Center(
            // Try to load asset, fallback to Text S
            child: ClipOval(
              child: Image.asset(
                'assets/images/logo.png',
                width: baseSize * 0.5,
                height: baseSize * 0.5,
                errorBuilder: (context, error, stackTrace) {
                   return Text(
                    'S', 
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.w900,
                      color: colorNavy,
                      fontSize: baseSize * 0.5
                    )
                  );
                },
              ),
            ),
          ),
        ),
      ],
    );

    Widget textAndProgress = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.text.isNotEmpty) ...[
          const SizedBox(height: 48), // mt-12 (12 * 4 = 48)
          Text(
            widget.text.toUpperCase(),
            style: GoogleFonts.plusJakartaSans(
               color: Colors.white,
               fontSize: 14,
               fontWeight: FontWeight.bold,
               letterSpacing: 4.2, // tracking-[0.3em] ~ 0.3 * 14 = 4.2
            ),
          ),
          const SizedBox(height: 12),
          // Elegant Line Progress
          ProgressLine(color: colorBronze),
        ]
      ],
    );

    Widget content = Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        coreLoader,
        textAndProgress,
      ],
    );

    if (widget.fullScreen) {
      return Stack(
        children: [
          // Background Backdrop
          Positioned.fill(
            child: ColoredBox(color: colorNavy.withOpacity(0.95)),
          ),
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5), // backdrop-blur-md
              child: Container(color: Colors.transparent),
            ),
          ),
          Center(child: content),
        ],
      );
    }

    return Center(child: content);
  }
}

class ArcPainter extends CustomPainter {
  final Color color;
  final double width;
  final double sweepAngle;
  final double startAngle;

  ArcPainter({required this.color, required this.width, required this.sweepAngle, this.startAngle = 0});

  @override
  void paint(Canvas canvas, Size size) {
    // Determine the rect for the arc
    // We want the arc to be on the edge, so we can use the full size
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round; // Rounded ends
      
    canvas.drawArc(rect, startAngle, sweepAngle, false, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class ProgressLine extends StatefulWidget {
  final Color color;
  const ProgressLine({super.key, required this.color});
  
  @override
  State<ProgressLine> createState() => _ProgressLineState();
}

class _ProgressLineState extends State<ProgressLine> with SingleTickerProviderStateMixin {
   late AnimationController _controller;
   
   @override
   void initState() {
     super.initState();
     _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat();
   }
   
   @override
   void dispose() {
     _controller.dispose();
     super.dispose();
   }
   
   @override
   Widget build(BuildContext context) {
      // w-24 = 96px
      return Container(
        width: 100, // approx 24rem -> 96px
        height: 2,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(2),
        ),
        clipBehavior: Clip.hardEdge,
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return FractionallySizedBox(
              widthFactor: 1, 
              child: CustomPaint(
                painter: GradientLinePainter(
                  progress: _controller.value,
                  color: widget.color,
                ),
              ),
            );
          },
        ),
      );
   }
}

class GradientLinePainter extends CustomPainter {
  final double progress;
  final Color color;
  
  GradientLinePainter({required this.progress, required this.color});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();
    
    // Simulate the gradient moving from -100% to 200%
    // Range of X is 0 to size.width
    // Let's say the gradient width is 50% of the bar (size.width / 2)
    // Moving from -width/2 to size.width + width/2
    final double gradientWidth = size.width * 0.6;
    final double start = -gradientWidth + (progress * (size.width + 2 * gradientWidth));
    
    final rect = Rect.fromLTWH(start, 0, gradientWidth, size.height);
    
    // Gradient: Transparent -> Color -> Transparent
    final gradient = LinearGradient(
      colors: [
        color.withOpacity(0.0),
        color,
        color.withOpacity(0.0),
      ],
      stops: const [0.0, 0.5, 1.0],
    );
    
    paint.shader = gradient.createShader(rect);
    canvas.drawRect(rect, paint);
  }
  
  @override
  bool shouldRepaint(GradientLinePainter oldDelegate) {
     return oldDelegate.progress != progress || oldDelegate.color != color;
  }
}
