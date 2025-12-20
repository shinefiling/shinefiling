package com.shinefiling;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.core.content.ContextCompat;

public class ClientHomeActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_client_home);

        // Setup Quick Actions
        setupQuickAction(R.id.action_rent, "Rent\nAgreement", R.drawable.ic_document, R.color.icon_blue,
                R.color.bg_icon_blue);
        setupQuickAction(R.id.action_gst, "GST\nFiling", R.drawable.ic_chart, R.color.icon_purple,
                R.color.bg_icon_purple);
        setupQuickAction(R.id.action_startup, "Startup\nReg", R.drawable.ic_rocket, R.color.icon_orange,
                R.color.bg_icon_orange);
        setupQuickAction(R.id.action_trademark, "Trade\nMark", R.drawable.ic_shield_check, R.color.icon_gold,
                R.color.bg_icon_gold);
        setupQuickAction(R.id.action_tax, "Income\nTax", R.drawable.ic_calculator, R.color.icon_green,
                R.color.bg_icon_green);
        setupQuickAction(R.id.action_company, "Legal\nConsultation", R.drawable.ic_gavel, R.color.icon_green,
                R.color.bg_icon_green);

        // Link Start Filing button to Service Catalog
        View btnStartFiling = findViewById(R.id.btn_start_filing);
        if (btnStartFiling != null) {
            btnStartFiling.setOnClickListener(v -> {
                startActivity(new android.content.Intent(this, ServiceCatalogActivity.class));
            });
        }
    }

    private void setupQuickAction(int containerId, String text, int iconResId, int iconTintRes, int bgTintRes) {
        View container = findViewById(containerId);
        if (container != null) {
            TextView tv = container.findViewById(R.id.tv_action_label);
            ImageView iv = container.findViewById(R.id.iv_action_icon);

            if (tv != null)
                tv.setText(text);
            if (iv != null) {
                iv.setImageResource(iconResId);
                iv.setColorFilter(ContextCompat.getColor(this, iconTintRes));
                iv.setBackgroundTintList(ContextCompat.getColorStateList(this, bgTintRes));
            }
        }
    }
}
