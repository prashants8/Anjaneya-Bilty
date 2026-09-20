import React from 'react';
import { LetterData } from '@/types/letter';

interface LetterHeadPrintViewProps {
  letterData: LetterData;
}

export const LetterHeadPrintView = React.forwardRef<HTMLDivElement, LetterHeadPrintViewProps>(
  ({ letterData }, ref) => {
    // Format date e.g. 15.03.2021
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      return dateStr;
    };

    return (
      <div
        ref={ref}
        style={{
          boxSizing: 'border-box',
          color: '#111827',
          backgroundColor: '#ffffff',
          width: '210mm',
          minHeight: '297mm',
          fontFamily: "'Noto Serif', 'Times New Roman', serif",
          paddingLeft: '20mm',
          paddingRight: '20mm',
          paddingBottom: '15mm',
          paddingTop: '0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* ===== HEADER AREA ===== */}
          {letterData.includeHeader ? (
            <div style={{
              paddingTop: '10mm',
              paddingBottom: '0',
              marginBottom: '0',
              fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
            }}>

              {/* Row 1: ARC Circle Logo + Company Name & Fleet Owner Box */}
              {/* Row 1: ARC Circle Logo + Company Name & Fleet Owner Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>

                {/* ARC Circle Logo */}
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: '#a81b1b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '22px',
                  letterSpacing: '2px',
                  flexShrink: 0,
                  marginRight: '14px',
                }}>
                  ARC
                </div>

                {/* Right side: Company Name + Fleet Owner Box */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>

                  {/* Company Name: ANJANEYA ROAD CARRIERS (Bold, Italic, Crimson Red) */}
                  <div style={{
                    display: 'flex',
                    margin: 0,
                    padding: 0,
                    color: '#a81b1b',
                    fontSize: '34px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    lineHeight: 1.05,
                    whiteSpace: 'nowrap',
                    fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
                  }}>
                    <span>A</span>
                    <span>NJANEYA ROAD CARRIERS</span>
                  </div>

                  {/* Fleet Owner Box: Starts exactly under 'N' in ANJANEYA, ends at right edge of CARRIERS */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '3px',
                    width: '100%',
                  }}>
                    {/* Invisible spacer matching the exact width of letter 'A' */}
                    <span style={{
                      color: 'transparent',
                      fontSize: '34px',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      letterSpacing: '0.025em',
                      lineHeight: 1.05,
                      userSelect: 'none',
                      fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
                    }}>
                      A
                    </span>

                    {/* Tight-fit height blue rectangle box */}
                    <div style={{
                      flex: 1,
                      border: '2px solid #15438c',
                      color: '#15438c',
                      fontWeight: 700,
                      fontSize: '14.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      textAlign: 'center',
                      padding: '2px 8px',
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
                    }}>
                      FLEET OWNER - TRANSPORT CONTRACTOR
                    </div>
                  </div>

                </div>
              </div>

              {/* Row 2: Office Address — Centered Blue Text */}
              <div style={{
                textAlign: 'center',
                fontSize: '10px',
                color: '#15438c',
                fontWeight: 500,
                marginTop: '6px',
                lineHeight: '1.45',
                fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
              }}>
                <div>
                  <strong style={{ fontWeight: 700 }}>Office : </strong>
                  38, 1<span style={{ fontSize: '7px', verticalAlign: 'super' }}>st</span> Floor, D. K. Complex, Nr. Swastik Petrol Pump, CHHATRAL - 382 729.
                </div>
                <div>
                  Tal. Kalol, <strong style={{ fontWeight: 700 }}>Dist. : </strong>Gandhinagar.&nbsp;
                  <strong style={{ fontWeight: 700 }}>M. : </strong>
                  <span style={{ fontWeight: 700 }}>98247 24842 / 82001 41051</span>
                </div>
              </div>

              {/* Blue horizontal divider line */}
              <div style={{
                borderBottom: '2px solid #15438c',
                marginTop: '6px',
                marginBottom: '0',
                width: '100%',
              }} />
            </div>
          ) : (
            /* Spacer for Pre-Printed Letterhead Paper */
            <div
              style={{
                height: `${letterData.headerMarginMm || 52}mm`,
                flexShrink: 0,
              }}
              className="w-full flex items-center justify-center print:border-none border border-dashed border-gray-300 rounded mb-2 text-[10px] text-gray-400 no-print"
            >
              [Pre-Printed Letterhead Space: {letterData.headerMarginMm || 52}mm]
            </div>
          )}

          {/* ===== REF NO & DATE LINE ===== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 700,
            marginTop: '8px',
            marginBottom: '18px',
            color: '#15438c',
            fontFamily: "'Noto Sans', Arial, Helvetica, sans-serif",
          }}>
            <div>
              <span>Ref. No. : </span>
              <span style={{ fontWeight: 500, color: '#111827' }}>
                {letterData.refNo || '________________'}
              </span>
            </div>
            <div>
              <span>Date : </span>
              <span style={{ fontWeight: 500, color: '#111827' }}>
                {formatDate(letterData.date) || '_____________'}
              </span>
            </div>
          </div>

          {/* ===== RECIPIENT DETAILS (Straight Left-Aligned) ===== */}
          <div style={{
            fontSize: '13px',
            lineHeight: '1.65',
            marginBottom: '12px',
            textAlign: 'left',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>To</div>
            {letterData.recipientName && (
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>
                {letterData.recipientName.startsWith('M/') || letterData.recipientName.startsWith('M/s') || letterData.recipientName.startsWith('M/S')
                  ? letterData.recipientName
                  : `M/s ${letterData.recipientName}`}
              </div>
            )}
            {letterData.recipientAddress ? (
              <div style={{ whiteSpace: 'pre-line', color: '#1f2937' }}>
                {letterData.recipientAddress}
              </div>
            ) : (
              <div style={{ color: '#9ca3af', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                [Recipient Address]
              </div>
            )}
          </div>

          {/* ===== SALUTATION ===== */}
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '12px',
            textAlign: 'left',
          }}>
            {letterData.salutation || 'Dear sir'}
          </div>

          {/* ===== SUBJECT (Optional) ===== */}
          {letterData.subject && (
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'underline',
              marginBottom: '12px',
              textAlign: 'left',
            }}>
              Sub: {letterData.subject}
            </div>
          )}

          {/* ===== MAIN BODY TEXT (Straight Left-Aligned, Clean Serif) ===== */}
          <div style={{
            fontSize: '13px',
            lineHeight: '1.75',
            color: '#111827',
            whiteSpace: 'pre-wrap',
            flex: 1,
            textAlign: 'left',
            fontFamily: "'Noto Serif', 'Times New Roman', serif",
          }}>
            {letterData.content}
          </div>

          {/* ===== CLOSING & SIGNATORY BLOCK (Straight Left-Aligned, matching Image 2) ===== */}
          <div style={{
            marginTop: '26px',
            paddingTop: '6px',
            display: 'flex',
            justifyContent: 'flex-start',
            textAlign: 'left',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                {letterData.closing || 'Regards'}
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                {letterData.signatoryName || 'J.S. Shukla'}
              </div>

              {/* Rubber Stamp with Blue Ink and Signature Overlay */}
              {letterData.showSignatureBlock && (
                <div style={{
                  position: 'relative',
                  border: '1.5px solid #15438c',
                  borderRadius: '3px',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(238, 242, 255, 0.4)',
                  color: '#15438c',
                  fontFamily: "'Noto Sans', Arial, sans-serif",
                  minWidth: '165px',
                  userSelect: 'none',
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.02em',
                  }}>
                    {letterData.companyName || 'Anjaneya Road Carriers'}
                  </div>
                  <div style={{
                    fontSize: '9.5px',
                    color: '#15438c',
                    marginTop: '1px',
                  }}>
                    {letterData.location || 'Chhatral Gujrat'}
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '10.5px',
                    marginTop: '2px',
                    textAlign: 'right',
                  }}>
                    {letterData.designation || 'Proprietor'}
                  </div>

                  {/* Authentic blue ink signature overlay */}
                  <svg
                    viewBox="0 0 120 40"
                    style={{
                      position: 'absolute',
                      right: '-8px',
                      top: '-6px',
                      width: '85px',
                      height: '42px',
                      pointerEvents: 'none',
                    }}
                  >
                    <path
                      d="M 6 26 Q 22 6, 38 22 T 62 10 Q 78 32, 96 8 T 114 20"
                      fill="none"
                      stroke="#15438c"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 16 30 Q 52 34, 110 26"
                      fill="none"
                      stroke="#15438c"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }
);

LetterHeadPrintView.displayName = 'LetterHeadPrintView';
