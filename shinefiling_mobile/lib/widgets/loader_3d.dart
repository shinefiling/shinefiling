import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:math' as math;

class Loader3D extends StatefulWidget {
  final double size;
  final String? text;

  const Loader3D({super.key, this.size = 100, this.text});

  @override
  State<Loader3D> createState() => _Loader3DState();
}

class _Loader3DState extends State<Loader3D> with TickerProviderStateMixin {
  late AnimationController _rotateController;
  late AnimationController _ring1Controller;
  late AnimationController _ring2Controller;

  // Premium Brand Colors derived from Logo
  static const Color brandGold = Color(0xFFD4AF37); // Rich Gold
  static const Color brandNavy = Color(0xFF0D1B21); // Deep Navy
  static const Color brandAccent = Color(0xFFE2B48A); // Soft Bronze

  @override
  void initState() {
    super.initState();
    _rotateController = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat();
    _ring1Controller = AnimationController(vsync: this, duration: const Duration(seconds: 10))..repeat();
    _ring2Controller = AnimationController(vsync: this, duration: const Duration(seconds: 6))..repeat();
  }

  @override
  void dispose() {
    _rotateController.dispose();
    _ring1Controller.dispose();
    _ring2Controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double halfSize = widget.size / 2;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: widget.size * 2.5,
            height: widget.size * 2.5,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Outer Ring (Navy/Grey - Subtle)
                _buildRing(
                  controller: _ring1Controller,
                  size: widget.size * 2.2,
                  color: brandNavy.withValues(alpha: 0.08),
                  strokeWidth: 1.5,
                  axis: Vector3(1, 1, 0),
                ),
                
                // Inner Ring (Gold - Active)
                _buildRing(
                  controller: _ring2Controller,
                  size: widget.size * 1.8,
                  color: brandGold.withValues(alpha: 0.6),
                  strokeWidth: 2.5,
                  axis: Vector3(1, 0, 1),
                  reverse: true,
                ),

                // 3D Cube with Z-Sorting
                AnimatedBuilder(
                  animation: _rotateController,
                  builder: (context, child) {
                    return Stack(
                      alignment: Alignment.center,
                      children: _buildSortedFaces(halfSize),
                    );
                  },
                ),
                
                // Bottom Glow Shadow (Gold)
                Positioned(
                  bottom: widget.size * 0.2,
                  child: Container(
                    width: widget.size,
                    height: 15,
                    decoration: BoxDecoration(
                      color: brandGold.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(100),
                      boxShadow: [
                         BoxShadow(
                           color: brandGold.withValues(alpha: 0.3), 
                           blurRadius: 30, 
                           spreadRadius: 5
                         )
                      ]
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          if (widget.text != null) ...[
            const SizedBox(height: 20),
            _buildLoadingText(),
          ],
        ],
      ),
    );
  }

  Widget _buildRing({
    required AnimationController controller,
    required double size,
    required Color color,
    required double strokeWidth,
    required Vector3 axis,
    bool reverse = false,
  }) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        double value = controller.value * 2 * math.pi;
        if (reverse) value = -value;
        
        // Create 3D rotation matrix for ring
        final matrix = Matrix4.identity()
          ..setEntry(3, 2, 0.001)
          ..rotateX(axis.x * value)
          ..rotateY(axis.y * value)
          ..rotateZ(axis.z * value);

        return Transform(
          transform: matrix,
          alignment: Alignment.center,
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: color, width: strokeWidth),
              boxShadow: [
                BoxShadow(color: color.withValues(alpha: 0.1), blurRadius: 5),
              ]
            ),
          ),
        );
      },
    );
  }

  List<Widget> _buildSortedFaces(double halfSize) {
    final double angleX = _rotateController.value * 2 * math.pi;
    final double angleY = _rotateController.value * 2 * math.pi;

    // Use Brand Navy for faces, Brand Gold for highlights
    final Color faceColor = brandNavy.withValues(alpha: 0.9);
    
    List<FaceDef> faces = [
      FaceDef(name: 'front',  translate: Vector3(0, 0, halfSize), rotation: Vector3(0, 0, 0), color: faceColor),
      FaceDef(name: 'back',   translate: Vector3(0, 0, -halfSize), rotation: Vector3(0, math.pi, 0), color: faceColor),
      FaceDef(name: 'right',  translate: Vector3(halfSize, 0, 0), rotation: Vector3(0, math.pi/2, 0), color: faceColor),
      FaceDef(name: 'left',   translate: Vector3(-halfSize, 0, 0), rotation: Vector3(0, -math.pi/2, 0), color: faceColor),
      FaceDef(name: 'top',    translate: Vector3(0, -halfSize, 0), rotation: Vector3(-math.pi/2, 0, 0), color: faceColor),
      FaceDef(name: 'bottom', translate: Vector3(0, halfSize, 0), rotation: Vector3(math.pi/2, 0, 0), color: faceColor),
    ];

    for (var face in faces) {
       face.transformedZ = _calculateProjectedZ(face.translate, angleX, angleY);
    }

    faces.sort((a, b) => a.transformedZ.compareTo(b.transformedZ));

    return faces.map((face) => _buildFaceWidget(face, halfSize * 2, angleX, angleY)).toList();
  }

  double _calculateProjectedZ(Vector3 point, double ax, double ay) {
    double x = point.x;
    double y = point.y;
    double z = point.z;
    double z1 = -x * math.sin(ay) + z * math.cos(ay);
    double y1 = y;
    double z2 = -y1 * math.sin(ax) + z1 * math.cos(ax);
    return z2; 
  }

  Widget _buildFaceWidget(FaceDef face, double size, double ax, double ay) {
     return Transform(
        alignment: Alignment.center,
        transform: Matrix4.identity()
          ..setEntry(3, 2, 0.001)
          ..rotateX(ax)
          ..rotateY(ay)
          ..translate(face.translate.x, face.translate.y, face.translate.z)
          ..rotateZ(face.rotation.z)
          ..rotateY(face.rotation.y)
          ..rotateX(face.rotation.x),
        
        child: Container(
           width: size,
           height: size,
           decoration: BoxDecoration(
             color: face.color,
             // Gold Borders
             border: Border.all(color: brandGold.withValues(alpha: 0.6), width: 1.5),
             boxShadow: [
               BoxShadow(color: brandNavy.withValues(alpha: 0.3), blurRadius: 10)
             ]
           ),
           child: Stack(
             children: [
               // Center Logo Hint (Gold 'S' or Line)
               Center(
                 child: Icon(Icons.business_center_rounded, color: brandGold.withValues(alpha: 0.4), size: size * 0.5),
               ),
               // Shine effect
               Center(
                 child: Transform.rotate(
                   angle: math.pi / 4,
                   child: Container(
                     width: size * 2,
                     height: 1,
                     color: Colors.white.withValues(alpha: 0.1),
                   ),
                 ),
               ),
             ],
           ),
        ),
     );
  }

  Widget _buildLoadingText() {
    return Column(
      children: [
        Text(
          widget.text!.toUpperCase(),
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w900,
            letterSpacing: 2.5,
            color: brandNavy,
            fontSize: 12
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (i) => _buildDot(i)),
        ),
      ],
    );
  }

  Widget _buildDot(int index) {
     return LoadDot(delay: index * 0.2, color: brandGold);
  }
}

class Vector3 {
  final double x, y, z;
  Vector3(this.x, this.y, this.z);
}

class FaceDef {
  final String name;
  final Vector3 translate;
  final Vector3 rotation;
  final Color color;
  double transformedZ = 0;

  FaceDef({required this.name, required this.translate, required this.rotation, required this.color});
}

class LoadDot extends StatefulWidget {
  final double delay;
  final Color color;
  const LoadDot({super.key, required this.delay, required this.color});

  @override
  State<LoadDot> createState() => _LoadDotState();
}

class _LoadDotState extends State<LoadDot> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        double t = (_controller.value + widget.delay) % 1.0;
        double opacity = (math.sin(t * math.pi * 2) + 1) / 2;
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 2.5),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
             shape: BoxShape.circle,
             color: widget.color.withValues(alpha: 0.4 + (0.6 * opacity)),
          ),
        );
      },
    );
  }
}
