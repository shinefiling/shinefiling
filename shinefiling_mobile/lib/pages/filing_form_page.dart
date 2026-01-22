import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';

class FilingFormPage extends StatefulWidget {
  final String serviceName;
  final String category;

  const FilingFormPage({super.key, required this.serviceName, required this.category});

  @override
  State<FilingFormPage> createState() => _FilingFormPageState();
}

class _FilingFormPageState extends State<FilingFormPage> {
  final _formKey = GlobalKey<FormState>();
  
  // -- CONTROLLERS & STATE --
  
  // User Contact (Primary)
  final _userNameController = TextEditingController();
  final _userMobileController = TextEditingController();
  final _userEmailController = TextEditingController();

  // Company Info
  final List<TextEditingController> _companyNameControllers = [TextEditingController(), TextEditingController(), TextEditingController()];
  final _activityController = TextEditingController();
  String? _selectedNature;
  final _authorizedCapitalController = TextEditingController(text: '100000');
  final _paidUpCapitalController = TextEditingController(text: '100000');

  // Address
  final _addressLine1Controller = TextEditingController();
  final _addressLine2Controller = TextEditingController();
  final _districtController = TextEditingController();
  final _pincodeController = TextEditingController();
  String? _selectedState;
  String _ownershipStatus = 'rented';

  // Directors
  List<Map<String, TextEditingController>> _directors = [];

  // Flow State
  bool _isLoading = false;
  int _currentStep = 0; // 0: Company, 1: Address, 2: Directors, 3: Uploads, 4: Success
  List<PlatformFile> _selectedFiles = [];

  // Constants
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  final List<String> _indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi', 'Other'
  ];

  final List<String> _businessNatures = ['IT / Software', 'Manufacturing', 'Service', 'Trading', 'Agriculture', 'Other'];

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
    _addDirector(); // Start with 1 director by default
    _addDirector(); // Min 2 for Pvt Ltd usually, but let's start with 2
  }

  Future<void> _loadUserProfile() async {
    final profile = await ApiService().getUserProfile();
    if (profile.isNotEmpty) {
      setState(() {
        _userNameController.text = profile['fullName'] ?? '';
        _userEmailController.text = profile['email'] ?? '';
        _userMobileController.text = profile['mobile'] ?? '';
      });
    }
  }

  void _addDirector() {
    setState(() {
      _directors.add({
        'name': TextEditingController(),
        'pan': TextEditingController(),
        'email': TextEditingController(),
        'mobile': TextEditingController(),
      });
    });
  }

  void _removeDirector(int index) {
    if (_directors.length > 2) {
      setState(() {
        _directors[index].values.forEach((c) => c.dispose());
        _directors.removeAt(index);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Minimum 2 Directors required')));
    }
  }

  @override
  void dispose() {
    // Dipose all controllers
    _userNameController.dispose(); _userMobileController.dispose(); _userEmailController.dispose();
    for (var c in _companyNameControllers) { c.dispose(); }
    _activityController.dispose(); _authorizedCapitalController.dispose(); _paidUpCapitalController.dispose();
    _addressLine1Controller.dispose(); _addressLine2Controller.dispose(); _districtController.dispose(); _pincodeController.dispose();
    for (var d in _directors) { d.values.forEach((c) => c.dispose()); }
    super.dispose();
  }

  // -- ACTIONS --

  Future<void> _pickFiles() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['jpg', 'pdf', 'png'],
        allowMultiple: true,
      );
      if (result != null) setState(() => _selectedFiles.addAll(result.files));
    } catch (e) {
      // ignore
    }
  }

  void _removeFile(int index) => setState(() => _selectedFiles.removeAt(index));

  void _nextStep() {
    if (_formKey.currentState!.validate()) {
        setState(() => _currentStep++);
    }
  }

  void _prevStep() => setState(() => _currentStep--);

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);

    // Build Payload to Match Web
    final formData = {
      'service': widget.serviceName,
      'category': widget.category,
      
      // Contact (User)
      'user_name': _userNameController.text,
      'user_email': _userEmailController.text,
      'user_mobile': _userMobileController.text,

      // Step 1: Company
      'companyNames': _companyNameControllers.map((c) => c.text).toList(),
      'businessActivity': _activityController.text,
      'natureOfBusiness': _selectedNature,
      'authorizedCapital': _authorizedCapitalController.text,
      'paidUpCapital': _paidUpCapitalController.text,

      // Step 2: Address
      'addressLine1': _addressLine1Controller.text,
      'addressLine2': _addressLine2Controller.text,
      'state': _selectedState,
      'district': _districtController.text,
      'pincode': _pincodeController.text,
      'ownershipStatus': _ownershipStatus,

      // Step 3: Directors
      'directors': _directors.map((d) => {
        'name': d['name']!.text,
        'pan': d['pan']!.text,
        'email': d['email']!.text,
        'phone': d['mobile']!.text,
      }).toList(),
    };

    List<String> paths = _selectedFiles.map((e) => e.path!).where((path) => path.isNotEmpty).toList();
    final success = await ApiService().submitApplication(formData, filePaths: paths);

    if (mounted) {
      setState(() {
        _isLoading = false;
        if (success) _currentStep = 4; // Success
        else ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Submission failed!')));
      });
    }
  }

  // -- UI BUILDERS --

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: Text(widget.serviceName, style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, color: brandNavy, size: 20), onPressed: () => Navigator.pop(context)),
      ),
      body: _currentStep == 4 ? _buildSuccessStep() : Column(
        children: [
          _buildProgressHeader(),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    if (_currentStep == 0) _buildStep1Company(),
                    if (_currentStep == 1) _buildStep2Address(),
                    if (_currentStep == 2) _buildStep3Directors(),
                    if (_currentStep == 3) _buildStep4Uploads(),
                  ],
                ),
              ),
            ),
          ),
          _buildBottomNav(),
        ],
      ),
    );
  }

  Widget _buildProgressHeader() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(4, (index) {
          bool active = index <= _currentStep;
          return Expanded(
            child: Row(
              children: [
                Container(
                  width: 28, height: 28,
                  decoration: BoxDecoration(
                    color: active ? brandNavy : Colors.grey.shade200,
                    shape: BoxShape.circle,
                  ),
                  child: Center(child: Text('${index + 1}', style: TextStyle(color: active ? Colors.white : Colors.grey, fontWeight: FontWeight.bold, fontSize: 12))),
                ),
                if (index < 3) Expanded(child: Container(height: 2, color: index < _currentStep ? brandNavy : Colors.grey.shade200, margin: const EdgeInsets.symmetric(horizontal: 4)))
              ],
            ),
          );
        }),
      ),
    );
  }

  // --- STEPS ---

  Widget _buildStep1Company() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Company Information', 'Proposed names and activity'),
        const SizedBox(height: 20),
        _buildTextField('Proposed Name 1 (Priority)', 'e.g. MyBiz Pvt Ltd', _companyNameControllers[0], Icons.business),
        const SizedBox(height: 12),
        _buildTextField('Proposed Name 2', 'Optional Backup', _companyNameControllers[1], Icons.business, isOptional: true),
        const SizedBox(height: 12),
        _buildTextField('Proposed Name 3', 'Optional Backup', _companyNameControllers[2], Icons.business, isOptional: true),
        const SizedBox(height: 20),
        _buildDropdown('Nature of Business', _businessNatures, _selectedNature, (v) => setState(() => _selectedNature = v), Icons.category),
        const SizedBox(height: 12),
        _buildTextField('Business Activity', 'Describe what your company does...', _activityController, Icons.description, maxLines: 3),
        const SizedBox(height: 20),
        Row(children: [
          Expanded(child: _buildTextField('Auth. Capital', '₹1,00,000', _authorizedCapitalController, Icons.currency_rupee, isNum: true)),
          const SizedBox(width: 12),
          Expanded(child: _buildTextField('Paid-up Capital', '₹1,00,000', _paidUpCapitalController, Icons.payments, isNum: true)),
        ]),
      ],
    );
  }

  Widget _buildStep2Address() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Registered Office', 'Communication address for the company'),
        const SizedBox(height: 20),
        _buildTextField('Address Line 1', 'Building / Flat No', _addressLine1Controller, Icons.location_on),
        const SizedBox(height: 12),
        _buildTextField('Address Line 2', 'Street / Area', _addressLine2Controller, Icons.map, isOptional: true),
        const SizedBox(height: 12),
        _buildDropdown('State', _indianStates, _selectedState, (v) => setState(() => _selectedState = v), Icons.map_outlined),
        const SizedBox(height: 12),
        Row(children: [
           Expanded(child: _buildTextField('District', 'City/District', _districtController, Icons.location_city)),
           const SizedBox(width: 12),
           Expanded(child: _buildTextField('Pincode', '123456', _pincodeController, Icons.pin_drop, isNum: true)),
        ]),
        const SizedBox(height: 20),
        const Text('Ownership Status', style: TextStyle(fontWeight: FontWeight.bold, color: brandNavy, fontSize: 13)),
        Row(children: [
           Expanded(child: RadioListTile(contentPadding: EdgeInsets.zero, title: const Text('Rented', style: TextStyle(fontSize: 14)), value: 'rented', groupValue: _ownershipStatus, onChanged: (v) => setState(() => _ownershipStatus = v!))),
           Expanded(child: RadioListTile(contentPadding: EdgeInsets.zero, title: const Text('Owned', style: TextStyle(fontSize: 14)), value: 'owned', groupValue: _ownershipStatus, onChanged: (v) => setState(() => _ownershipStatus = v!))),
        ]),
      ],
    );
  }

  Widget _buildStep3Directors() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Director Details', 'Min 2 Directors Required'),
        const SizedBox(height: 10),
        ..._directors.asMap().entries.map((entry) {
            int i = entry.key;
            var d = entry.value;
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('Director ${i + 1}', style: const TextStyle(fontWeight: FontWeight.bold, color: brandBronze)),
                    if (_directors.length > 2) InkWell(onTap: () => _removeDirector(i), child: const Icon(Icons.delete_outline, color: Colors.red, size: 20))
                  ]),
                  const SizedBox(height: 12),
                  _buildTextField('Full Name', 'As per PAN', d['name']!, Icons.person),
                  const SizedBox(height: 12),
                  _buildTextField('PAN Number', 'ABCDE1234F', d['pan']!, Icons.badge),
                  const SizedBox(height: 12),
                  Row(children: [
                     Expanded(child: _buildTextField('Mobile', '10  Digits', d['mobile']!, Icons.phone, isNum: true)),
                     const SizedBox(width: 12),
                     Expanded(child: _buildTextField('Email', 'Valid Email', d['email']!, Icons.email, isOptional: true)), // Email optional in quick form?
                  ])
                ],
              ),
            );
        }),
        if (_directors.length < 5)
        OutlinedButton.icon(
          onPressed: _addDirector,
          icon: const Icon(Icons.add, size: 18),
          label: const Text('Add Director'),
          style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 48), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        )
      ],
    );
  }

  Widget _buildStep4Uploads() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Documents', 'Upload KYC proofs'),
        const SizedBox(height: 16),
        InkWell(
          onTap: _pickFiles,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: brandBronze, style: BorderStyle.solid)),
            child: Column(children: [
               Icon(Icons.cloud_upload_outlined, size: 40, color: brandBronze),
               const SizedBox(height: 10),
               Text('Tap to Upload Files', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy)),
               const Text('PAN, Aadhaar, Photo, Address Proof', style: TextStyle(fontSize: 12, color: Colors.grey))
            ]),
          ),
        ),
        const SizedBox(height: 16),
        ..._selectedFiles.asMap().entries.map((e) => ListTile(
           dense: true,
           contentPadding: EdgeInsets.zero,
           leading: const Icon(Icons.file_present, color: brandNavy),
           title: Text(e.value.name, maxLines: 1, overflow: TextOverflow.ellipsis),
           subtitle: Text('${(e.value.size/1024).round()} KB'),
           trailing: IconButton(icon: const Icon(Icons.close, size: 18, color: Colors.red), onPressed: () => _removeFile(e.key)),
        ))
      ],
    );
  }

  // --- WIDGET HELPER ---
  Widget _buildSectionTitle(String title, String sub) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold, color: brandNavy)),
      Text(sub, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey)),
    ]);
  }

  Widget _buildTextField(String lbl, String hint, TextEditingController ctrl, IconData icon, {bool isOptional=false, bool isNum=false, int maxLines=1}) {
    return TextFormField(
      controller: ctrl,
      keyboardType: isNum ? TextInputType.number : TextInputType.text,
      maxLines: maxLines,
      validator: (v) => isOptional || (v!=null && v.isNotEmpty) ? null : '$lbl required',
      decoration: InputDecoration(
        labelText: lbl,
        hintText: hint,
        prefixIcon: Icon(icon, size: 18, color: Colors.grey),
        filled: true, fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: brandNavy),
    );
  }

  Widget _buildDropdown(String lbl, List<String> items, String? val, Function(String?) onChange, IconData icon) {
    return DropdownButtonFormField<String>(
      value: val,
      items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
      onChanged: onChange,
      validator: (v) => v == null ? 'Required' : null,
      decoration: InputDecoration(
        labelText: lbl,
        prefixIcon: Icon(icon, size: 18, color: Colors.grey),
        filled: true, fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0,-5))]),
      child: Row(children: [
        if (_currentStep > 0) Expanded(child: OutlinedButton(onPressed: _prevStep, style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Back'))),
        if (_currentStep > 0) const SizedBox(width: 16),
        Expanded(flex: 2, child: ElevatedButton(
          onPressed: _currentStep == 3 ? _submitForm : _nextStep,
          style: ElevatedButton.styleFrom(backgroundColor: brandNavy, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
          child: _isLoading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : Text(_currentStep == 3 ? 'Submit' : 'Next', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        )),
      ]),
    );
  }

  Widget _buildSuccessStep() {
    return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
       const Icon(Icons.check_circle, size: 80, color: Colors.green),
       const SizedBox(height: 20),
       const Text('Application Submitted!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: brandNavy)),
       const SizedBox(height: 10),
       const Padding(padding: EdgeInsets.all(20), child: Text('Our team will review your application and contact you shortly.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey))),
       ElevatedButton(onPressed: () => Navigator.pop(context), style: ElevatedButton.styleFrom(backgroundColor: brandNavy, padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15)), child: const Text('Go Home', style: TextStyle(color: Colors.white)))
    ]));
  }
}
