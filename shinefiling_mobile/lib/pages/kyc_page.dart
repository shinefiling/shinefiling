import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';

class KycPage extends StatefulWidget {
  const KycPage({super.key});

  @override
  State<KycPage> createState() => _KycPageState();
}

class _KycPageState extends State<KycPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  final _panController = TextEditingController();
  final _aadhaarController = TextEditingController();
  String? _panPath;
  String? _aadhaarPath;
  bool _isLoading = false;

  Future<void> _pickFile(bool isPan) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'png'],
    );
    if (result != null) {
      setState(() {
        if (isPan) _panPath = result.files.single.path;
        else _aadhaarPath = result.files.single.path;
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (_panController.text.isEmpty || _aadhaarController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);
    final result = await ApiService().submitKyc(
      pan: _panController.text,
      aadhaar: _aadhaarController.text,
      panPath: _panPath,
      aadhaarPath: _aadhaarPath,
    );

    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['message'])));
      if (result['success']) Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: Text('KYC Verification', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: brandNavy, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(),
            const SizedBox(height: 32),
            _buildField('PAN Number', 'ABCDE1234F', _panController),
            const SizedBox(height: 16),
            _buildFileUpload('Upload PAN Card', _panPath, () => _pickFile(true)),
            const SizedBox(height: 32),
            _buildField('Aadhaar Number', '1234 5678 9012', _aadhaarController),
            const SizedBox(height: 16),
            _buildFileUpload('Upload Aadhaar Card', _aadhaarPath, () => _pickFile(false)),
            const SizedBox(height: 48),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: Colors.white10,
            child: Icon(Icons.security_rounded, color: Colors.white),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Identity Verification',
                  style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  'Verify your identity to enable all features.',
                  style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildField(String label, String hint, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hint,
            fillColor: Colors.white,
            filled: true,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Widget _buildFileUpload(String label, String? path, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: brandNavy.withValues(alpha: 0.1)),
        ),
        child: Row(
          children: [
            Icon(Icons.cloud_upload_outlined, color: brandBronze),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                path != null ? path.split('/').last : label,
                style: GoogleFonts.plusJakartaSans(fontSize: 14, color: path != null ? brandNavy : Colors.grey),
              ),
            ),
            if (path != null) const Icon(Icons.check_circle, color: Colors.green, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleSubmit,
        style: ElevatedButton.styleFrom(
          backgroundColor: brandNavy,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: _isLoading 
          ? const CircularProgressIndicator(color: Colors.white)
          : const Text('Submit for Verification', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
