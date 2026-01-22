import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class VoiceCallPage extends StatefulWidget {
  final String expertName;
  final String expertRole;
  
  const VoiceCallPage({
    super.key, 
    this.expertName = 'Filing Expert',
    this.expertRole = 'Online Consultant'
  });

  @override
  State<VoiceCallPage> createState() => _VoiceCallPageState();
}

class _VoiceCallPageState extends State<VoiceCallPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  bool _micOn = true;
  bool _speakerOn = false;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: brandNavy,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  const Icon(Icons.security_rounded, color: Colors.white54, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    'End-to-end Encrypted', 
                    style: GoogleFonts.plusJakartaSans(color: Colors.white54, fontSize: 12)
                  ),
                ],
              ),
            ),
            
            // Central Info
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(4), // Border width
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: brandBronze.withOpacity(0.3), width: 1),
                  ),
                  child: const CircleAvatar(
                    radius: 70,
                    backgroundImage: NetworkImage('https://i.pravatar.cc/300?u=expert'),
                    backgroundColor: Colors.grey,
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  widget.expertName,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Calling...',
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white70,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            
            // Bottom Controls
            Container(
              padding: const EdgeInsets.only(bottom: 40),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildControlBtn(
                    icon: _speakerOn ? Icons.volume_up_rounded : Icons.volume_off_rounded,
                    label: 'Speaker',
                    isActive: _speakerOn,
                    onTap: () => setState(() => _speakerOn = !_speakerOn),
                  ),
                  _buildControlBtn(
                    icon: _micOn ? Icons.mic_rounded : Icons.mic_off_rounded,
                    label: 'Mute',
                    isActive: !_micOn, // Highlight if MUTED is active state in UI commonly, or standard toggle
                    onTap: () => setState(() => _micOn = !_micOn),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(color: Colors.redAccent, blurRadius: 20, spreadRadius: 1)
                        ]
                      ),
                      child: const Icon(
                        Icons.call_end_rounded,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlBtn({required IconData icon, required String label, bool isActive = false, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isActive ? Colors.white : Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: isActive ? brandNavy : Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white70,
              fontSize: 12,
            ),
          )
        ],
      ),
    );
  }
}
