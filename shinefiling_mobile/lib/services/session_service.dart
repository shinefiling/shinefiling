import 'dart:async';
import 'package:flutter/material.dart';
import '../pages/lock_screen_page.dart';

class SessionService extends NavigatorObserver with WidgetsBindingObserver {
  // Singleton
  static final SessionService _instance = SessionService._internal();
  factory SessionService() => _instance;
  SessionService._internal();

  GlobalKey<NavigatorState>? _navigatorKey;
  DateTime? _pausedTime;
  final int _timeoutSeconds = 30; // 30 Seconds Timeout
  bool _isLocked = false;
  String? _currentRoute;

  void initialize(GlobalKey<NavigatorState> navigatorKey) {
    _navigatorKey = navigatorKey;
    WidgetsBinding.instance.addObserver(this);
  }

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
  }

  // --- Navigator Observer Methods ---
  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    _currentRoute = route.settings.name;
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPop(route, previousRoute);
    _currentRoute = previousRoute?.settings.name;
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    _currentRoute = newRoute?.settings.name;
  }
  // ----------------------------------

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // If not initialized or we are on public pages, don't track time
    if (_navigatorKey == null) return;
    if (_isPublicPage(_currentRoute)) {
      _pausedTime = null;
      return;
    }

    if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      _pausedTime = DateTime.now();
    } else if (state == AppLifecycleState.resumed) {
      if (_pausedTime != null) {
        final duration = DateTime.now().difference(_pausedTime!);
        if (duration.inSeconds >= _timeoutSeconds) {
          _showLockScreen();
        }
      }
      _pausedTime = null;
    }
  }

  bool _isPublicPage(String? route) {
    if (route == null) return false;
    // Don't lock on Login, Signup, Splash, or if already Locked
    return route == '/' || route == '/login' || route == '/signup' || route == '/lock';
  }

  void _showLockScreen() {
    if (_isLocked) return;
    if (_navigatorKey?.currentState == null) return;
    
    // Double check we aren't on a public page (in case navigation happened while paused)
    if (_isPublicPage(_currentRoute)) return;

    _isLocked = true;
    _navigatorKey!.currentState!.push(
      MaterialPageRoute(
        settings: const RouteSettings(name: '/lock'),
        builder: (context) => const LockScreenPage(),
        fullscreenDialog: true,
      ),
    ).then((_) {
      _isLocked = false;
    });
  }
}
