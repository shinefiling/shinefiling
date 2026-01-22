import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart'; // Using file_picker instead of image_picker as per pubspec
import '../services/api_service.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  
  // Controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController(); // Read-only typically
  final _mobileController = TextEditingController();

  bool _isLoading = false;
  String? _profileImageUrl;
  String? _localImagePath;

  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    setState(() => _isLoading = true);
    final user = await ApiService().getUserProfile();
    setState(() {
      _isLoading = false;
      if (user.isNotEmpty) {
        _nameController.text = user['fullName'] ?? '';
        _emailController.text = user['email'] ?? '';
        _mobileController.text = user['mobile'] ?? '';
        _profileImageUrl = user['profileImage'];
        
        // Sanitize URL for localhost if needed (handled by ApiService but good to be safe)
        if (_profileImageUrl != null && _profileImageUrl!.contains('localhost')) {
            // It should have been fixed by ApiService, but...
             final host = ApiService().baseUrl.split('://')[1].split(':')[0]; // basic hack
             _profileImageUrl = _profileImageUrl!.replaceAll('localhost', host);
        }
      }
    });
  }

  Future<void> _pickImage() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.image,
      allowMultiple: false,
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _localImagePath = result.files.single.path;
      });
    }
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);

    // 1. Upload Image if changed
    if (_localImagePath != null) {
      await ApiService().uploadProfilePicture(_localImagePath!);
    }

    // 2. Update Text Data
    final data = {
      'fullName': _nameController.text.trim(),
      'mobile': _mobileController.text.trim(),
    };
    
    final result = await ApiService().updateProfile(data);

    setState(() => _isLoading = false);

    if (mounted) {
      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully')),
        );
        Navigator.pop(context, true); // Return true to trigger reload
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? 'Failed to update')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: Text(
          'Edit Profile', 
          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.white)
        ),
        backgroundColor: brandNavy,
        centerTitle: true,
        leading: const BackButton(color: Colors.white),
      ),
      body: _isLoading && _nameController.text.isEmpty
          ? const Center(child: CircularProgressIndicator(color: brandBronze))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildImagePicker(),
                    const SizedBox(height: 32),
                    _buildTextField('Full Name', _nameController, Icons.person_outline_rounded),
                    const SizedBox(height: 16),
                    _buildTextField('Email Address', _emailController, Icons.email_outlined, readOnly: true),
                    const SizedBox(height: 16),
                    _buildTextField('Mobile Number', _mobileController, Icons.phone_android_rounded, isPhone: true),
                    const SizedBox(height: 40),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _saveProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: brandNavy,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 2,
                        ),
                        child: _isLoading 
                          ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: brandBronze, strokeWidth: 2))
                          : Text('Save Changes', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildImagePicker() {
    ImageProvider imageProvider;
    if (_localImagePath != null) {
      imageProvider = FileImage(File(_localImagePath!));
    } else if (_profileImageUrl != null && _profileImageUrl!.isNotEmpty) {
      imageProvider = NetworkImage(_profileImageUrl!);
    } else {
      imageProvider = const NetworkImage('https://i.pravatar.cc/150?u=user');
    }

    return Center(
      child: Stack(
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
              boxShadow: [
                 BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 5))
              ],
              image: DecorationImage(
                image: imageProvider,
                fit: BoxFit.cover,
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: GestureDetector(
              onTap: _pickImage,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: brandBronze,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, 
      {bool readOnly = false, bool isPhone = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label, 
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold, 
            color: brandNavy, 
            fontSize: 14
          )
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: readOnly ? Colors.grey.shade200 : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: TextFormField(
            controller: controller,
            readOnly: readOnly,
            keyboardType: isPhone ? TextInputType.phone : TextInputType.text,
            validator: (value) {
              if (readOnly) return null;
              if (value == null || value.trim().isEmpty) return '$label is required';
              if (isPhone && value.length < 10) return 'Invalid mobile number';
              return null;
            },
            decoration: InputDecoration(
              prefixIcon: Icon(icon, color: brandNavy.withOpacity(0.5)),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              hintText: 'Enter $label',
              hintStyle: GoogleFonts.plusJakartaSans(color: Colors.grey.withOpacity(0.5)),
            ),
            style: GoogleFonts.plusJakartaSans(
              color: readOnly ? Colors.grey : brandNavy,
              fontWeight: FontWeight.w600
            ),
          ),
        ),
      ],
    );
  }
}
