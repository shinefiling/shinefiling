import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CareersPage extends StatelessWidget {
  const CareersPage({super.key});

  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildSliverHeader(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildIntroSection(),
                  const SizedBox(height: 32),
                  _buildSectionTitle('Active Openings'),
                  const SizedBox(height: 16),
                  _buildJobCard('Senior Filing Expert', 'Bangalore / Remote', 'Full-time', '₹6L - 10L GPA'),
                  const SizedBox(height: 16),
                  _buildJobCard('Legal Content Strategist', 'Chennai / Remote', 'Contract', '₹4L - 6L GPA'),
                  const SizedBox(height: 16),
                  _buildJobCard('Flutter Developer', 'Remote', 'Full-time', '₹8L - 15L GPA'),
                  const SizedBox(height: 32),
                  _buildPerksSection(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliverHeader(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      backgroundColor: brandNavy,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: false,
        titlePadding: const EdgeInsets.only(left: 24, bottom: 16),
        title: Text(
          'Join the Mission.',
          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 24),
        ),
        background: Opacity(
          opacity: 0.3,
          child: Container( // Added Container to hold DecorationImage
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070'),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildIntroSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'We\'re Building the Future of Compliance',
          style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: brandNavy),
        ),
        const SizedBox(height: 12),
        Text(
          'At Shine Filing, we don\'t just file documents. We empower entrepreneurs to fly. Join our team of legal tech innovators.',
          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: brandNavy.withValues(alpha: 0.5), height: 1.6),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandBronze, letterSpacing: 1.5),
    );
  }

  Widget _buildJobCard(String title, String loc, String type, String pay) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 16, color: brandNavy)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: brandBronze.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                child: Text(type, style: GoogleFonts.plusJakartaSans(color: brandBronze, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.location_on_outlined, size: 14, color: brandNavy.withValues(alpha: 0.4)),
              const SizedBox(width: 4),
              Text(loc, style: GoogleFonts.plusJakartaSans(color: brandNavy.withValues(alpha: 0.4), fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(width: 16),
              Icon(Icons.payments_outlined, size: 14, color: brandNavy.withValues(alpha: 0.4)),
              const SizedBox(width: 4),
              Text(pay, style: GoogleFonts.plusJakartaSans(color: brandNavy.withValues(alpha: 0.4), fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: brandNavy,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: const Text('Apply Now', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerksSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Why You\'ll Love it Here'),
        const SizedBox(height: 16),
        _buildPerkItem(Icons.rocket_launch_rounded, 'Fast Growth', 'We grow as you grow.'),
        const SizedBox(height: 12),
        _buildPerkItem(Icons.health_and_safety_rounded, 'Insurance', 'Comprehensive family cover.'),
        const SizedBox(height: 12),
        _buildPerkItem(Icons.laptop_chromebook_rounded, 'Gear', 'Latest MacBooks for everyone.'),
      ],
    );
  }

  Widget _buildPerkItem(IconData icon, String title, String desc) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle),
          child: Icon(icon, color: brandBronze, size: 20),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14, color: brandNavy)),
            Text(desc, style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 11)),
          ],
        ),
      ],
    );
  }
}
