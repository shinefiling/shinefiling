import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

class BusinessHealthPage extends StatefulWidget {
  const BusinessHealthPage({super.key});

  @override
  State<BusinessHealthPage> createState() => _BusinessHealthPageState();
}

class _BusinessHealthPageState extends State<BusinessHealthPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  bool _isAnalyzing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F1EF),
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildAdvancedScoreCard(),
                const SizedBox(height: 32),
                _buildComplianceTimeline(),
                const SizedBox(height: 32),
                _buildAITaxForecast(),
                const SizedBox(height: 32),
                _buildRunwaySimulator(), // NEW: Cash Flow Survival
                const SizedBox(height: 32),
                _buildIndustryBenchmark(), // NEW: Peer Comparison
                const SizedBox(height: 32),
                _buildExpenseAnomalies(), // NEW: Auto-Audit
                const SizedBox(height: 32),
                _buildSectionTitle('Active Compliance Checks'),
                const SizedBox(height: 16),
                _buildComplianceGrid(),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ).animate().fadeIn(duration: 600.ms),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 120,
      pinned: true,
      backgroundColor: brandNavy,
      elevation: 0,
      leading: const BackButton(color: Colors.white),
      flexibleSpace: FlexibleSpaceBar(
        title: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'CFO Intelligence',
              style: GoogleFonts.plusJakartaSans(
                fontWeight: FontWeight.w900, fontSize: 20, color: Colors.white,
              ),
            ),
            Text(
              'Real-time Financial Health',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 10, color: Colors.white70, fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [brandNavy, const Color(0xFF1A3A4A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAdvancedScoreCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(color: brandNavy.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('BUSINESS HEALTH SCORE', style: GoogleFonts.plusJakartaSans(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                child: Text('+12% vs Last Month', style: GoogleFonts.plusJakartaSans(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 180,
            width: 180,
            child: Stack(
              fit: StackFit.expand,
              children: [
                CircularProgressIndicator(
                  value: 0.85,
                  strokeWidth: 15,
                  backgroundColor: Colors.white10,
                  valueColor: const AlwaysStoppedAnimation(brandBronze),
                  strokeCap: StrokeCap.round,
                ),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('850', style: GoogleFonts.plusJakartaSans(fontSize: 48, fontWeight: FontWeight.w900, color: Colors.white)),
                      Text('EXCELLENT', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w800, color: brandBronze, letterSpacing: 2)),
                    ],
                  ),
                ),
              ],
            ),
          ).animate().scale(duration: 800.ms, curve: Curves.easeOutBack),
          const SizedBox(height: 16),
          Text(
            'Your compliance framework is robust.',
            textAlign: TextAlign.center,
             style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildAITaxForecast() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('AI Tax Forecast'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: brandBronze.withOpacity(0.2)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.auto_awesome_rounded, color: brandBronze, size: 20),
                  const SizedBox(width: 8),
                  Text('PROJECTED LIABILITY', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandBronze, letterSpacing: 1.5)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('GST Output', style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text('₹ 24,500', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold, color: brandNavy)),
                      ],
                    ),
                  ),
                  Container(width: 1, height: 30, color: Colors.grey.shade300),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Likely TDS', style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text('₹ 4,200', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold, color: brandNavy)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: const Color(0xFFF9FAFB), borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    const Icon(Icons.lightbulb_rounded, color: Colors.amber, size: 18),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Tip: You have ₹12,000 unclaimed Input Credit. File GSTR-3B by 20th to save.',
                        style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF4B5563), fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildComplianceTimeline() {
    final events = [
      {'date': '11', 'month': 'MAY', 'title': 'GSTR-1 Due', 'status': 'due', 'desc': 'Outward supplies for April'},
      {'date': '15', 'month': 'MAY', 'title': 'PF/ESI Payment', 'status': 'upcoming', 'desc': 'Monthly contribution'},
      {'date': '20', 'month': 'MAY', 'title': 'GSTR-3B', 'status': 'upcoming', 'desc': 'Consolidated Return'},
      {'date': '30', 'month': 'JUN', 'title': 'Advance Tax', 'status': 'future', 'desc': 'Q1 Payment'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Compliance Calendar'),
        const SizedBox(height: 16),
        SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: events.length,
            physics: const BouncingScrollPhysics(),
            itemBuilder: (context, index) {
              final e = events[index];
              bool isDue = e['status'] == 'due';
              return Container(
                width: 140,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDue ? brandNavy : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isDue ? Colors.white.withOpacity(0.1) : brandNavy.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${e['date']} ${e['month']}',
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.bold, fontSize: 12,
                          color: isDue ? brandBronze : brandNavy,
                        ),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                           e['title']!,
                           style: GoogleFonts.plusJakartaSans(
                             fontWeight: FontWeight.w800, fontSize: 14,
                             color: isDue ? Colors.white : brandNavy,
                           ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                           e['desc']!,
                           maxLines: 2,
                           style: GoogleFonts.plusJakartaSans(
                             fontSize: 10,
                             color: isDue ? Colors.white60 : Colors.grey,
                           ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // === NEW CFO FEATURES ===

  Widget _buildRunwaySimulator() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Cash Flow Survival'), // "Runway"
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: brandNavy,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [BoxShadow(color: brandNavy.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 10))],
          ),
          child: Column(
             crossAxisAlignment: CrossAxisAlignment.start,
             children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.timer_rounded, color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('ESTIMATED RUNWAY', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.white54, fontWeight: FontWeight.bold)),
                        Text('4.5 Months', style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Simulation: If Revenue Drops 20%',
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, color: brandBronze, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Stack(
                  children: [
                    Container(height: 6, decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(3))),
                    FractionallySizedBox(widthFactor: 0.6, child: Container(height: 6, decoration: BoxDecoration(color: brandBronze, borderRadius: BorderRadius.circular(3)))),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Safe Zone. You have enough buffer for Q3.',
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white38),
                ),
             ],
          ),
        ),
      ],
    );
  }

  Widget _buildIndustryBenchmark() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Industry Benchmarking'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
             color: Colors.white,
             borderRadius: BorderRadius.circular(24),
             border: Border.all(color: Colors.grey.shade200),
          ),
          child: Column(
            children: [
              _buildBenchmarkBar('Net Margin', 0.22, 0.15, '7% > Avg'), // User 22%, Industry 15%
              const SizedBox(height: 24),
              _buildBenchmarkBar('OpEx Ratio', 0.30, 0.45, '15% < Avg (Good)'), // User 30%, Industry 45%
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBenchmarkBar(String label, double userVal, double marketVal, String insight) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
           mainAxisAlignment: MainAxisAlignment.spaceBetween,
           children: [
             Text(label, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy, fontSize: 13)),
             Text(insight, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 11)),
           ],
        ),
        const SizedBox(height: 12),
        Stack(
          children: [
            // Market Average
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(height: 8, width: 250, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(4))),
                const SizedBox(height: 4),
                Text('Industry Avg', style: GoogleFonts.plusJakartaSans(fontSize: 8, color: Colors.grey)),
              ],
            ),
            // User Value
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                   height: 8, 
                   width: 250 * (userVal / 0.5), // Scaling for demo
                   decoration: BoxDecoration(
                     gradient: LinearGradient(colors: [brandNavy, brandBronze]), 
                     borderRadius: BorderRadius.circular(4)
                   ),
                ),
                 const SizedBox(height: 4),
                 Text('You', style: GoogleFonts.plusJakartaSans(fontSize: 8, color: brandNavy, fontWeight: FontWeight.bold)),
              ],
            ),
            // Marker for Industry
            Positioned(
              left: 250 * (marketVal / 0.5),
              child: Container(
                height: 8, width: 2, color: Colors.grey,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildExpenseAnomalies() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildSectionTitle('Audit Watchdog'),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
              child: Text('2 ALERTS', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.red)),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.red.withOpacity(0.1)),
            boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.05), blurRadius: 15, offset: const Offset(0, 5))],
          ),
          child: Column(
            children: [
              ListTile(
                leading: Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: Colors.red.shade50, shape: BoxShape.circle), child: Icon(Icons.warning_rounded, color: Colors.red.shade400, size: 20)),
                title: Text('Duplicate Vendor Payment', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold, color: brandNavy)),
                subtitle: Text('TechCorp Solutions: ₹12,500 charged twice.', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey)),
                trailing: Text('Dismiss', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.red)),
              ),
              Divider(height: 1, color: Colors.grey.shade100),
              ListTile(
                 leading: Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: Colors.orange.shade50, shape: BoxShape.circle), child: Icon(Icons.analytics_rounded, color: Colors.orange.shade400, size: 20)),
                 title: Text('Unusual Spike in Travel', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold, color: brandNavy)),
                 subtitle: Text('Travel expenses +40% vs 6-month avg.', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey)),
                 trailing: Text('View', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: brandNavy)),
              ),
            ],
          ),
        ),
      ],
    );
  }


  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w900, color: brandNavy),
    );
  }

  Widget _buildComplianceGrid() {
    final status = [
       {'label': 'Tax Complaince', 'status': 'Healthy', 'icon': Icons.account_balance_rounded},
       {'label': 'Legal Structure', 'status': 'Healthy', 'icon': Icons.gavel_rounded},
       {'label': 'Documentation', 'status': 'Action Needed', 'icon': Icons.folder_shared_rounded},
       {'label': 'Annual Returns', 'status': 'Up to date', 'icon': Icons.description_rounded},
    ];

    return GridView.builder(
       shrinkWrap: true,
       physics: const NeverScrollableScrollPhysics(),
       gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
         crossAxisCount: 2,
         crossAxisSpacing: 16,
         mainAxisSpacing: 16,
         childAspectRatio: 1.1,
       ),
       itemCount: status.length,
       itemBuilder: (context, index) {
         final item = status[index];
         bool isAlert = item['status'] == 'Action Needed';
         return Container(
           padding: const EdgeInsets.all(16),
           decoration: BoxDecoration(
             color: Colors.white,
             borderRadius: BorderRadius.circular(24),
             border: Border.all(color: isAlert ? Colors.orange.withOpacity(0.1) : Colors.transparent),
           ),
           child: Column(
             crossAxisAlignment: CrossAxisAlignment.start,
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Icon(item['icon'] as IconData, color: isAlert ? Colors.orange : brandBronze, size: 28),
               Column(
                 crossAxisAlignment: CrossAxisAlignment.start,
                 children: [
                   Text(
                     item['label'] as String,
                     style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold, color: brandNavy),
                   ),
                   const SizedBox(height: 4),
                   Text(
                     item['status'] as String,
                     style: GoogleFonts.plusJakartaSans(
                       fontSize: 10, fontWeight: FontWeight.w900,
                       color: isAlert ? Colors.orange : Colors.green,
                     ),
                   ),
                 ],
               ),
             ],
           ),
         );
       },
    );
  }
}
