import React from 'react';

const ProfessionalInvoice = ({ shop, cart, customerName, invoiceNo }) => {
  // गणना (Calculations)
  const totalTaxable = cart?.reduce((acc, item) => acc + (Number(item.rate || item.price) * Number(item.qty || 1)), 0) || 0;
  const totalGST = cart?.reduce((acc, item) => acc + ((Number(item.cgst) || 0) + (Number(item.sgst) || 0)), 0) || 0;
  const totalDiscount = cart?.reduce((acc, item) => acc + (Number(item.discount_amt) || 0), 0) || 0;
  const grandTotal = Math.round(totalTaxable + totalGST);

  return (
    <div className="print-area" style={styles.a4Paper}>
      
      {/* --- टैक्स इनवॉइस हेडर (फोटो के अनुसार) --- */}
      <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '5px' }}>
        <b style={{ fontSize: '14px' }}>TAX INVOICE</b>
      </div>

      <div style={styles.headerGrid}>
        <div style={styles.brandBox}>
          <h1 style={styles.brandName}>{shop?.shop_name?.toUpperCase() || "NM MART"}</h1>
          <p style={styles.addressText}>{shop?.address || "Naya Nagar, First Dhata Road, Manjhanpur, Kaushambi, UP-212207"}</p>
          <p style={styles.boldText}>GSTIN :- {shop?.gstin || "09CCFPR9966P1Z9"}</p>
          
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={styles.stateTag}>State - UTTAR PRADESH</span>
            <span style={{ fontSize: '12px', marginLeft: '10px' }}>State Code - 09</span>
          </div>
        </div>

        <div style={styles.billInfoBox}>
          <p><b>Bill No. :-</b> {invoiceNo || '54'}</p>
          <p><b>Bill To :-</b> {customerName?.toUpperCase() || 'CASH'}</p>
          <p><b>Bill Date :-</b> {new Date().toLocaleDateString('en-GB')}</p>
          <p><b>Address :-</b> ________________</p>
          <p><b>GSTIN :-</b> ________________</p>
        </div>
      </div>

      {/* --- मेन आइटम टेबल --- */}
      <table style={styles.mainTable}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.cell}>Sr.</th>
            <th style={{ ...styles.cell, width: '30%' }}>Item Name</th>
            <th style={styles.cell}>HSN</th>
            <th style={styles.cell}>MRP</th>
            <th style={styles.cell}>Rate</th>
            <th style={styles.cell}>Qty</th>
            <th style={styles.cell}>Disc%</th>
            <th style={styles.cell}>Taxable</th>
            <th style={styles.cell}>CGST</th>
            <th style={styles.cell}>SGST</th>
            <th style={styles.cell}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart?.map((item, i) => (
            <tr key={i}>
              <td style={styles.cell}>{i + 1}</td>
              <td style={{ ...styles.cell, textAlign: 'left' }}>{item.name}</td>
              <td style={styles.cell}>{item.hsn || '190590'}</td>
              <td style={styles.cell}>{item.mrp || item.price}</td>
              <td style={styles.cell}>{item.rate || item.price}</td>
              <td style={styles.cell}>{item.qty} {item.uom || 'Kg'}</td>
              <td style={styles.cell}>{item.disc_percent || '0.00'}</td>
              <td style={styles.cell}>{(item.qty * (item.rate || item.price)).toFixed(2)}</td>
              <td style={styles.cell}>{(item.cgst || 0).toFixed(2)}</td>
              <td style={styles.cell}>{(item.sgst || 0).toFixed(2)}</td>
              <td style={styles.cell}>{(item.qty * (item.rate || item.price) + (item.cgst || 0) + (item.sgst || 0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- जीएसटी और समरी बॉक्स (फोटो के अनुसार) --- */}
      <div style={styles.footerGrid}>
        <div style={styles.gstBox}>
          <b>GST Details :-</b>
          <table style={styles.miniTable}>
            <thead>
              <tr><th>Rate</th><th>Sub Total</th><th>Discount</th><th>Total</th><th>C-GST</th><th>S-GST</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>5% & 18%</td>
                <td>{totalTaxable.toFixed(2)}</td>
                <td>{totalDiscount.toFixed(2)}</td>
                <td>{totalTaxable.toFixed(2)}</td>
                <td>{(totalGST / 2).toFixed(2)}</td>
                <td>{(totalGST / 2).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: '10px', fontSize: '12px' }}>
            <b>Bill Amt in Words:-</b> Rupee {grandTotal} Only
          </p>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.summaryRow}><span>Total Discount Amt :-</span><span>{totalDiscount.toFixed(2)}</span></div>
          <div style={styles.summaryRow}><span>Total Taxable Amt :-</span><span>{totalTaxable.toFixed(2)}</span></div>
          <div style={styles.summaryRow}><span>CGST :-</span><span>{(totalGST / 2).toFixed(2)}</span></div>
          <div style={styles.summaryRow}><span>SGST :-</span><span>{(totalGST / 2).toFixed(2)}</span></div>
          <div style={styles.totalRow}><b>Total Bill Amount :-</b><b>{grandTotal}</b></div>
        </div>
      </div>

      {/* --- बैंक, नियम और सिग्नेचर --- */}
      <div style={styles.bottomSection}>
        <div style={styles.bottomBox}>
          <b>Terms & Conditions :-</b>
          <ul style={{ fontSize: '10px', paddingLeft: '15px', margin: '5px 0' }}>
            <li>This is computer generated invoice.</li>
            <li>Goods once sold will not be returned.</li>
            <li>All disputes are subject to local jurisdiction.</li>
          </ul>
        </div>
        <div style={styles.bottomBox}>
          <b>Bank Details :-</b>
          <p style={{ fontSize: '11px', margin: '5px 0' }}>
            NM MART<br/>
            Ac No. - 781530150000006<br/>
            Bank Name - Bank Of India<br/>
            IFSC Code - BKID0007815
          </p>
        </div>
        <div style={{ ...styles.bottomBox, textAlign: 'right', borderRight: 'none' }}>
          <p style={{ fontSize: '12px' }}>For <b>NM MART</b></p>
          <br/><br/>
          <b>Authorised Signatory</b>
        </div>
      </div>
    </div>
  );
};

// --- प्रोफेशनल स्टाइल्स (फोटो से मैचिंग) ---
const styles = {
  a4Paper: { width: '210mm', minHeight: '290mm', padding: '10mm', background: '#fff', border: '1px solid #000', margin: '0 auto', color: '#000', fontFamily: 'Calibri, Arial' },
  headerGrid: { display: 'flex', border: '1px solid #000', borderTop: 'none' },
  brandBox: { flex: 2, padding: '10px', borderRight: '1px solid #000' },
  brandName: { margin: 0, fontSize: '26px', color: '#000' },
  addressText: { fontSize: '11px', margin: '5px 0' },
  boldText: { fontSize: '13px', fontWeight: 'bold' },
  stateTag: { background: '#f2f2f2', padding: '2px 8px', border: '1px solid #000', fontSize: '11px', fontWeight: 'bold' },
  billInfoBox: { flex: 1.2, padding: '10px', fontSize: '12px' },
  mainTable: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' },
  tableHeaderRow: { background: '#f2f2f2', fontSize: '11px' },
  cell: { border: '1px solid #000', padding: '6px', textAlign: 'center', fontSize: '11px' },
  footerGrid: { display: 'flex', border: '1px solid #000', borderTop: 'none' },
  gstBox: { flex: 2, padding: '10px', borderRight: '1px solid #000' },
  miniTable: { width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'center', marginTop: '5px' },
  summaryBox: { flex: 1.2, padding: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', marginTop: '5px', paddingTop: '5px', fontSize: '14px' },
  bottomSection: { display: 'flex', border: '1px solid #000', borderTop: 'none' },
  bottomBox: { flex: 1, padding: '10px', borderRight: '1px solid #000', minHeight: '90px' }
};

export default ProfessionalInvoice;