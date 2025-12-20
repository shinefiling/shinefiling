package com.shinefiling.common.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.shinefiling.licenses.model.FssaiApplication;
import com.shinefiling.licenses.service.FssaiService;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private FssaiService fssaiService;

    private final String KEY_ID = "rzp_test_v9bZpQvmrVnUzZ";
    private final String KEY_SECRET = "7WK71mMmiIYb4ZLi4Mcw1eDl"; // Using provided keys

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.parseDouble(data.get("amount").toString());

            RazorpayClient razorpay = new RazorpayClient(KEY_ID, KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", " txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString()); // Returns the full order object as string JSON

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server Error: " + e.getMessage());
        }
    }

    @GetMapping("/invoice/{submissionId}")
    public ResponseEntity<?> getInvoice(@PathVariable String submissionId) {
        FssaiApplication app = fssaiService.getApplication(submissionId);
        if (app == null)
            return ResponseEntity.notFound().build();

        String html = "<html><head><title>Invoice " + submissionId + "</title>"
                + "<style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:auto;}"
                + ".header{display:flex;justify-content:space-between;border-bottom:2px solid #eee;padding-bottom:20px;margin-bottom:30px;}"
                + ".logo{font-size:24px;font-weight:bold;color:#333;}"
                + ".invoice-details{text-align:right;}"
                + "table{width:100%;border-collapse:collapse;margin-bottom:30px;}"
                + "th,td{padding:12px;text-align:left;border-bottom:1px solid #eee;}"
                + ".total{font-size:18px;font-weight:bold;text-align:right;}"
                + ".footer{margin-top:50px;text-align:center;color:#777;font-size:12px;}"
                + "</style></head><body>"
                + "<div class='header'>"
                + "<div class='logo'>ShineFiling</div>"
                + "<div class='invoice-details'>"
                + "<h1>INVOICE</h1>"
                + "<p>Date: "
                + (app.getUpdatedAt() != null ? app.getUpdatedAt().toLocalDate() : java.time.LocalDate.now())
                + "</p>"
                + "<p>Invoice #: " + submissionId + "</p>"
                + "</div>"
                + "</div>"

                + "<div class='bill-to'>"
                + "<h3>Bill To:</h3>"
                + "<p>" + (app.getApplicantName() != null ? app.getApplicantName() : "Valued Customer") + "</p>"
                + "<p>" + (app.getBusinessName() != null ? app.getBusinessName() : "") + "</p>"
                + "<p>" + (app.getAddress() != null ? app.getAddress() : "") + "</p>"
                + "<p>" + (app.getEmail() != null ? app.getEmail() : "") + "</p>"
                + "</div>"

                + "<table style='margin-top:30px;'>"
                + "<thead><tr style='background:#f9f9f9;'><th>Description</th><th>Qty</th><th>Price</th></tr></thead>"
                + "<tbody>"
                + "<tr><td>FSSAI Registration - " + app.getLicenseType() + "</td><td>1</td><td>₹" + app.getAmountPaid()
                + "</td></tr>"
                + "</tbody>"
                + "</table>"

                + "<div class='total'>"
                + "<p>Grand Total: ₹" + app.getAmountPaid() + "</p>"
                + "</div>"

                + "<div class='footer'>"
                + "<p>Thank you for your business!</p>"
                + "<p>ShineFiling Inc, 123 Business Park, Chennai, India</p>"
                + "</div>"
                + "<script>window.print();</script>" // Auto print
                + "</body></html>";

        return ResponseEntity.ok().header("Content-Type", "text/html").body(html);
    }
}
