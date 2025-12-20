package com.shinefiling;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import java.util.ArrayList;
import java.util.List;

public class ServiceCatalogActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_service_catalog);

        // Setup Header interactions
        setupHeader();

        // Setup Service Grid
        // In a real app, we would use a RecyclerView Adapter here.
        // For this mock, we are defining the layout primarily in XML to match the
        // requested design.
    }

    private void setupHeader() {
        ImageView backBtn = findViewById(R.id.btn_back);
        if (backBtn != null) {
            backBtn.setOnClickListener(v -> finish());
        }
    }
}
