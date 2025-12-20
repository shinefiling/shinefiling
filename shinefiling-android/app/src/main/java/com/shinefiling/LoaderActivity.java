package com.shinefiling;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.LinearInterpolator;
import androidx.appcompat.app.AppCompatActivity;

public class LoaderActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loader);

        View cubeView = findViewById(R.id.cube_view);
        View ring1 = findViewById(R.id.ring_1);
        View ring2 = findViewById(R.id.ring_2);

        // 1. Rotate Cube on X and Y axes continuously
        ObjectAnimator rotateX = ObjectAnimator.ofFloat(cubeView, "rotationX", 0f, 360f);
        rotateX.setDuration(4000);
        rotateX.setRepeatCount(ObjectAnimator.INFINITE);
        rotateX.setInterpolator(new LinearInterpolator());
        rotateX.start();

        ObjectAnimator rotateY = ObjectAnimator.ofFloat(cubeView, "rotationY", 0f, 360f);
        rotateY.setDuration(4000); // Same duration for synchronized rotation
        rotateY.setRepeatCount(ObjectAnimator.INFINITE);
        rotateY.setInterpolator(new LinearInterpolator());
        rotateY.start();

        // 2. Rotate Rings - Slowly
        ObjectAnimator rotateRing1 = ObjectAnimator.ofFloat(ring1, "rotation", 0f, 360f);
        rotateRing1.setDuration(8000);
        rotateRing1.setRepeatCount(ObjectAnimator.INFINITE);
        rotateRing1.setInterpolator(new LinearInterpolator());
        rotateRing1.start();

        ObjectAnimator rotateRing2 = ObjectAnimator.ofFloat(ring2, "rotation", 360f, 0f);
        rotateRing2.setDuration(8000);
        rotateRing2.setRepeatCount(ObjectAnimator.INFINITE);
        rotateRing2.setInterpolator(new LinearInterpolator());
        rotateRing2.start();

        // 3. Move to Next Screen after 3 seconds
        new Handler().postDelayed(() -> {
            Intent intent = new Intent(LoaderActivity.this, ClientHomeActivity.class);
            startActivity(intent);
            finish();
        }, 3500);
    }
}
