package com.tms.util;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tms.models.Payment;
import com.tms.models.Registration;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGeneratorUtils {

    public static ByteArrayInputStream generatePaymentReceipt(Payment payment) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.DARK_GRAY);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font successFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(46, 125, 50)); // Dark green

            Paragraph title = new Paragraph("TRANSPORT MANAGEMENT SYSTEM", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            Paragraph subtitle = new Paragraph("PAYMENT RECEIPT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.GRAY));
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(30);
            document.add(subtitle);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            Registration reg = payment.getRegistration();

            addTableCell(table, "Transaction ID:", boldFont);
            addTableCell(table, payment.getTransactionId(), textFont);

            addTableCell(table, "Payment Date:", boldFont);
            addTableCell(table, payment.getPaymentDate().format(dateTimeFormatter), textFont);

            addTableCell(table, "Payment Method:", boldFont);
            addTableCell(table, payment.getPaymentMethod(), textFont);

            addTableCell(table, "Amount Paid:", boldFont);
            addTableCell(table, "$" + String.format("%.2f", payment.getAmount()), textFont);

            addTableCell(table, "Payment Status:", boldFont);
            addTableCell(table, payment.getStatus(), successFont);

            addTableCell(table, "Passenger Name:", boldFont);
            addTableCell(table, reg.getUser().getName(), textFont);

            addTableCell(table, "User Role / ID:", boldFont);
            addTableCell(table, reg.getUser().getRole().name().substring(5) + " (" + reg.getUser().getUsername() + ")", textFont);

            addTableCell(table, "Route Code:", boldFont);
            addTableCell(table, reg.getRoute().getRouteNumber() + " (" + reg.getRoute().getOrigin() + " to " + reg.getRoute().getDestination() + ")", textFont);

            addTableCell(table, "Boarding Point:", boldFont);
            addTableCell(table, reg.getBoardingPoint().getName() + " (Time: " + reg.getBoardingPoint().getPickupTime() + ")", textFont);

            addTableCell(table, "Bus Allocated:", boldFont);
            addTableCell(table, reg.getBus() != null ? reg.getBus().getBusNumber() + " (" + reg.getBus().getModel() + ")" : "Pending allocation", textFont);

            addTableCell(table, "Seat Number:", boldFont);
            addTableCell(table, reg.getSeat() != null ? reg.getSeat().getSeatNumber() : "Pending allocation", textFont);

            document.add(table);

            Paragraph footer = new Paragraph("\n\nThank you for choosing our Transport Service!\nFor queries, support, or refund requests, please contact transport admin.\nThis is a computer generated receipt and does not require signatures.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private static void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(10);
        cell.setBorderColor(Color.LIGHT_GRAY);
        table.addCell(cell);
    }
}
