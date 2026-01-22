import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AboutUsPage extends StatelessWidget {
  const AboutUsPage({super.key});

  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildHero(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStorySection(),
                  const SizedBox(height: 40),
                  _buildStatsGrid(),
                  const SizedBox(height: 40),
                  _buildValuesSection(),
                  const SizedBox(height: 40),
                  _buildTeamSection(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHero(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: brandNavy,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
              fit: BoxFit.cover,
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [brandNavy.withValues(alpha: 0.9), brandNavy.withValues(alpha: 0.4)],
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'WE SIMPLIFY THE',
                    style: GoogleFonts.plusJakartaSans(
                      color: brandBronze,
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Impossible.',
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1,
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

  Widget _buildStorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          height: 250,
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            image: const DecorationImage(
              image: AssetImage('assets/images/driven_by_purpose_team_v2.png'),
              fit: BoxFit.cover,
            ),
            boxShadow: [
              BoxShadow(
                color: brandNavy.withValues(alpha: 0.1),
                blurRadius: 20,
                offset: const Offset(0, 10),
              )
            ],
          ),
        ),
        const SizedBox(height: 32),
        Text(
          'Driven By Purpose',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: brandNavy,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'ShineFiling was born from a simple observation: India\'s entrepreneurs were spending more time on paperwork than on their product. We decided to change that.',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 15,
            color: brandNavy.withValues(alpha: 0.6),
            height: 1.6,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsGrid() {
    return GridView(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        mainAxisExtent: 130, // Fixed height ensures content always fits
      ),
      children: [
        _buildStatCard('10k+', 'Happy Clients', Icons.group),
        _buildStatCard('50k+', 'Filings', Icons.check_circle),
        _buildStatCard('12+', 'Years Exp', Icons.work),
        _buildStatCard('100%', 'Security', Icons.shield),
      ],
    );
  }

  Widget _buildStatCard(String val, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: brandBronze, size: 24),
            const SizedBox(height: 12),
            Text(val, style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: brandNavy)),
            Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildValuesSection() {
    return Column(
      children: [
        _buildValueItem('Precision', '100% accuracy in every filing.', Icons.track_changes),
        const SizedBox(height: 16),
        _buildValueItem('Speed', 'Automated systems for 50% faster processing.', Icons.bolt),
        const SizedBox(height: 16),
        _buildValueItem('Integrity', 'Bank-grade encryption for your data.', Icons.lock),
      ],
    );
  }

  Widget _buildValueItem(String title, String desc, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: brandBronze.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
            child: Icon(icon, color: brandBronze, size: 24),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(desc, style: GoogleFonts.plusJakartaSans(color: Colors.white60, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Our Leadership',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: brandNavy,
          ),
        ),
        const SizedBox(height: 24),
        _buildExpertCard('Venkatesan', 'CEO & Founder', 'assets/images/expert_venkatesan.png'),
        const SizedBox(height: 16),
        _buildExpertCard('Prabhu', 'Head of Legal', 'assets/images/expert_prabhu.png'),
      ],
    );
  }

  Widget _buildExpertCard(String name, String role, String img) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30, 
            backgroundImage: img.startsWith('http') 
              ? NetworkImage(img) 
              : AssetImage(img) as ImageProvider
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy, fontSize: 16)),
                Text(role, style: GoogleFonts.plusJakartaSans(color: brandBronze, fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
