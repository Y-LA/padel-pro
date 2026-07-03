/* ===========================
   PADEL PRO — dashboard.js
   Dashboard summary page module
=========================== */

const DashboardPage = {
  _monthChart: null,
  _ready: false,

  init() {
    if (!this._ready) {
      this._attachListeners();
      this._ready = true;
    }
    this._render();
    requestAnimationFrame(() => this._render());
    setTimeout(() => this._render(), 250);
  },

  _attachListeners() {
    document.addEventListener('mockDataReady', () => {
      this._render();
      requestAnimationFrame(() => this._render());
    });

    document.addEventListener('mockDataUpdated', () => {
      this._render();
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this._render();
    });

    window.addEventListener('resize', debounce(() => {
      this._render();
    }, 150));
  },

  _render() {
    const el = document.getElementById('page-dashboard');
    if (!el) return;
    const b = window.mockData.bookings;
    const today = todayISO();

    const currentMonth = today.slice(0, 7); // yyyy-mm
    const monthBookings = b.filter(x => x.date.startsWith(currentMonth));
    
    const mTotal     = monthBookings.length;
    const mConfirmed = monthBookings.filter(x => x.status === 'confirmed').length;
    const mRevenue   = monthBookings.reduce((s, x) => s + getPaidRevenue(x), 0);

    const todayDate = window.formatAppDate(new Date(), { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    const monthName = window.formatAppDate(new Date(), { month: 'long', year: 'numeric' });

    const goal = parseFloat(window.mockData.settings?.monthGoal) || 0;
    let goalHtml = `<div class="ms-stat-val">—</div>`;
    
    if (goal > 0) {
      if (mRevenue >= goal) {
         goalHtml = `<div class="ms-stat-val goal-reached" style="color:#10B981">${window.formatNumber(goal)} <span class="goal-check bounce-in">🏆 ✓</span></div>`;
      } else {
         const percent = Math.min(Math.floor((mRevenue / goal) * 100), 100);
         goalHtml = `<div class="ms-stat-val">${window.formatNumber(goal)} <span style="font-size:0.85rem;color:#0F6E56">(${percent}%)</span></div>`;
      }
    }

    const firebaseUser = firebase.auth().currentUser;
    const userName = escapeHTML(
      firebaseUser?.displayName?.split(' ')[0]
      || firebaseUser?.email?.split('@')[0]
      || window.t('adminDefaultName')
    );

    el.innerHTML = `
      <div class="dash-welcome">
        <div>
          <h2 class="dash-greeting">${window.t('dashboardGreeting', { name: userName })}</h2>
          <p class="dash-date">${todayDate}</p>
        </div>
        <button class="btn btn-primary" onclick="navigateTo('bookings')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${window.t('newBooking')}
        </button>
      </div>

      <div class="month-summary-card">
        <div class="month-summary-chart">
           <canvas id="dash-month-chart"></canvas>
        </div>
        <div class="month-summary-stats">
           <div class="month-summary-header">
             <h3>${window.t('monthSummary')}</h3>
             <p>${monthName}</p>
           </div>
           <div class="month-summary-grid">
              <div class="ms-stat">
                 <div class="ms-stat-icon" style="color:#0F6E56"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                 <div class="ms-stat-info">
                   <div class="ms-stat-val">${window.formatNumber(mRevenue)}</div>
                   <div class="ms-stat-lbl">${window.t('sales')}</div>
                 </div>
              </div>
              <div class="ms-stat">
                 <div class="ms-stat-icon" style="color:#0F6E56"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                 <div class="ms-stat-info">
                   <div class="ms-stat-val">${window.formatNumber(mConfirmed)}</div>
                   <div class="ms-stat-lbl">${window.t('confirmedBookings')}</div>
                 </div>
              </div>
              <div class="ms-stat">
                 <div class="ms-stat-icon" style="color:#0F6E56"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10M5 4v7a7 7 0 0 0 14 0V4"/></svg></div>
                 <div class="ms-stat-info">
                   ${goalHtml}
                   <div class="ms-stat-lbl">${window.t('monthGoal')}</div>
                 </div>
              </div>
              <div class="ms-stat">
                 <div class="ms-stat-icon" style="color:#0F6E56"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                 <div class="ms-stat-info">
                   <div class="ms-stat-val">${window.formatNumber(mTotal)}</div>
                   <div class="ms-stat-lbl">${window.t('totalBookings')}</div>
                 </div>
              </div>
           </div>
           <div class="month-summary-footer">
             <a href="#/reports" onclick="navigateTo('reports')">${window.t('moreReports')}</a>
           </div>
        </div>
      </div>

      ${this._renderUpcomingAlert(b)}

      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-card-header">
            <h3 class="dash-card-title">${window.t('pendingReview')}</h3>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('bookings')">${window.t('viewAll')}</button>
          </div>
          <div id="dash-pending-list"></div>
        </div>
        <div class="dash-card">
          <div class="dash-card-header">
            <h3 class="dash-card-title">${window.t('courtsStatusToday')}</h3>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('courts')">${window.t('manageCourts')}</button>
          </div>
          <div id="dash-courts-list"></div>
        </div>
      </div>

      <div class="dash-card dash-today-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${window.t('fullTodaySchedule')}
          </h3>
          <div style="display:flex;align-items:center;gap:8px">
            <span id="dash-today-count" class="badge badge-confirmed">0 ${window.t('booking_count_suffix')}</span>
            <button class="btn btn-ghost btn-sm" onclick="DashboardPage._printDailyReport()" title="${window.t('printTodayReport')}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              ${window.t('printTodayReport')}
            </button>
          </div>
        </div>
        <div id="dash-today-list"></div>
      </div>`;

    this._renderPending(b, today);
    this._renderCourts(today);
    this._renderTodaySchedule(b, today);
    this._renderMonthChart(monthBookings, currentMonth);
  },

  // ── Month Summary Chart (Bar graph for daily trends) ───────────────
  _renderMonthChart(monthBookings, currentMonth) {
    const ctx = document.getElementById('dash-month-chart');
    if (!ctx || !window.Chart) return;
    
    const [year, monthStr] = currentMonth.split('-');
    const daysInMonth = new Date(year, monthStr, 0).getDate();
    const labels = [];
    const data = new Array(daysInMonth).fill(0);
    
    for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${i}/${parseInt(monthStr)}`);
    }
    
    monthBookings.filter(b => b.status === 'confirmed').forEach(b => {
      const d = parseInt(b.date.split('-')[2]);
      if (d >= 1 && d <= daysInMonth) {
        data[d - 1] += getBookingSystemTotal(b);
      }
    });

    if (this._monthChart) this._monthChart.destroy();
    
    this._monthChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: '#0F6E56',
          borderRadius: 2,
          barPercentage: 0.8,
          hoverBackgroundColor: '#0A4A3A'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E2A24',
            titleFont: { family: 'Cairo', size: 13 },
            bodyFont: { family: 'Cairo', size: 14, weight: 'bold' },
            displayColors: false,
            callbacks: {
              label: function(context) { return window.formatCurrency(context.parsed.y); }
            }
          }
        },
        scales: {
          y: { display: false, beginAtZero: true },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7, 
              color: '#0F6E56',
              font: { family: 'Cairo', weight: '700' }
            }
          }
        }
      }
    });
  },

  // ── Upcoming bookings alert (next 2 hours) ────────────────────────
  _renderUpcomingAlert(bookings) {
    const now    = new Date();
    const in2h   = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const today  = todayISO();
    const upcoming = bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (b.date !== today) return false;
      const dt = new Date(`${b.date}T${b.startTime}`);
      return dt >= now && dt <= in2h;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!upcoming.length) return '';

    const unpaidUpcoming = upcoming.filter(b => b.paymentStatus !== 'paid');
    const alertClass = unpaidUpcoming.length > 0 ? 'dash-upcoming-alert dash-upcoming-warn' : 'dash-upcoming-alert';
    const alertTitle = unpaidUpcoming.length > 0
      ? window.t('unpaidStartsSoon', { count: unpaidUpcoming.length })
      : window.t('startsWithinTwoHours');

    return `
      <div class="${alertClass}">
        <div class="dash-upcoming-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="dash-upcoming-body">
          <div class="dash-upcoming-title">${alertTitle}</div>
          <div class="dash-upcoming-items">${upcoming.map(b => {
            const unpaid = b.paymentStatus !== 'paid';
            return `<span class="dash-upcoming-chip${unpaid ? ' chip-unpaid' : ''}">${b.courtName} &mdash; ${b.startTime} &mdash; ${b.customerName.split(' ')[0]}${unpaid ? ' ○' : ''}</span>`;
          }).join('')}</div>
        </div>
      </div>`;
  },

  // ── Today's full schedule ─────────────────────────────────────────
  _renderTodaySchedule(bookings, today) {
    const el = document.getElementById('dash-today-list');
    if (!el) return;

    const todayBk = bookings
      .filter(b => b.date === today && b.status !== 'cancelled')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const badge = document.getElementById('dash-today-count');
    if (badge) badge.textContent = `${todayBk.length} ${window.t('booking_count_suffix')}`;

    if (todayBk.length === 0) {
      el.innerHTML = `<div class="dash-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>${window.t('noBookings')}</p></div>`;
      return;
    }

    const now = new Date();
    const nowTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const revenue = todayBk.reduce((s, b) => s + getPaidRevenue(b), 0);
    const unpaidCount = todayBk.filter(b => b.paymentStatus !== 'paid').length;
    const esc = window.escapeHTML || (s => s);

    el.innerHTML = `
      <div class="today-stats-row">
        <div class="today-stat"><span>${todayBk.length}</span><small>${window.t('totalBookings')}</small></div>
        <div class="today-stat"><span style="color:var(--primary)">${todayBk.filter(b=>b.status==='confirmed').length}</span><small>${window.t('bookings_kpi_confirmed')}</small></div>
        <div class="today-stat"><span style="color:var(--primary)">${formatCurrency(revenue)}</span><small>${window.t('paid')}</small></div>
        ${unpaidCount > 0 ? `<div class="today-stat"><span style="color:var(--delete)">${unpaidCount}</span><small>${window.t('unpaid')}</small></div>` : ''}
      </div>
      <div class="today-timeline">
        ${todayBk.map(b => {
          const isPast    = b.endTime ? b.endTime <= nowTime : b.startTime < nowTime;
          const isCurrent = b.startTime <= nowTime && (!b.endTime || b.endTime > nowTime);
          const payStatus = b.paymentStatus || 'unpaid';
          const payBg     = payStatus === 'paid' ? 'rgba(29,158,117,0.1)' : payStatus === 'partial' ? 'rgba(212,136,10,0.1)' : 'rgba(192,57,43,0.08)';
          const payColor  = payStatus === 'paid' ? 'var(--primary)' : payStatus === 'partial' ? 'var(--amber)' : 'var(--delete)';
          const payLabel  = payStatus === 'paid' ? `✓ ${window.t('paid')}` : payStatus === 'partial' ? `◑ ${window.t('partial')}` : `○ ${window.t('unpaid')}`;
          const statusBadge = b.status === 'confirmed' ? '' :
            `<span style="font-size:0.7rem;background:rgba(212,136,10,0.12);color:var(--amber);padding:2px 7px;border-radius:4px;font-weight:700">${window.t('filter_pending')}</span>`;
          return `
            <div class="today-bk-item${isPast ? ' today-bk-past' : ''}${isCurrent ? ' today-bk-current' : ''}">
              ${isCurrent ? '<span class="today-live-dot"></span>' : ''}
              <div class="today-bk-time-block">
                <div class="today-bk-time">${esc(b.startTime)}${b.endTime ? ' – '+esc(b.endTime) : ''}</div>
                <div class="today-bk-court-tag">${esc(b.courtName)}</div>
              </div>
              <div class="today-bk-info">
                <div class="today-bk-name">${esc(b.customerName)} ${statusBadge}</div>
                <div class="today-bk-phone">${esc(window.formatPhoneDisplay ? window.formatPhoneDisplay(b.phone) : b.phone)}</div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                <span style="font-size:0.75rem;font-weight:700;padding:3px 9px;border-radius:20px;background:${payBg};color:${payColor}">${payLabel}</span>
                <div class="today-bk-price">${formatCurrency(getBookingSystemTotal(b))}</div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  _renderPending(bookings, today) {
    const pending = bookings.filter(b => b.status === 'pending').slice(0, 6);
    const el = document.getElementById('dash-pending-list');
    if (!el) return;
    if (pending.length === 0) {
      el.innerHTML = `<div class="dash-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p>${window.t('noBookings')}</p></div>`;
      return;
    }
    const esc = window.escapeHTML || (s => s);
    el.innerHTML = pending.map(b => `
      <div class="dash-booking-item">
        <div class="dash-booking-info">
          <div class="dash-booking-name">${esc(b.customerName)}</div>
          <div class="dash-booking-meta">${esc(b.courtName)} • ${b.date.split('-').reverse().join('/')} • ${esc(b.startTime)}</div>
        </div>
        <div class="dash-booking-price">${formatCurrency(getBookingSystemTotal(b))}</div>
        <div class="dash-booking-actions">
          <button class="btn-accept" onclick="DashboardPage._accept('${b.id}')">${window.t('accept')}</button>
          <button class="btn-reject" onclick="DashboardPage._reject('${b.id}')">${window.t('reject')}</button>
        </div>
      </div>`).join('');
  },

  _renderCourts(today) {
    const el = document.getElementById('dash-courts-list');
    if (!el) return;
    const SPORT_DOT = { padel:'var(--primary)', tennis:'var(--amber)', squash:'var(--blue)' };
    el.innerHTML = window.mockData.courts.map(c => {
      const todayB = window.mockData.bookings.filter(b => b.courtId === c.id && b.date === today && b.status !== 'cancelled').length;
      const nextB  = window.mockData.bookings.filter(b => b.courtId === c.id && b.date === today && b.status !== 'cancelled')
        .sort((a,b) => a.startTime.localeCompare(b.startTime))[0];
      return `
        <div class="dash-court-item">
          <div class="dash-court-dot" style="background:${SPORT_DOT[c.sport] || 'var(--primary)'}"></div>
          <div class="dash-court-info">
            <div class="dash-court-name">${c.name}</div>
            <div class="dash-court-meta">${todayB} ${window.t('booking_count_suffix')}${nextB ? ' • ' + nextB.startTime : ''}</div>
          </div>
          <span class="badge ${c.status === 'active' ? 'badge-confirmed' : 'badge-cancelled'}">${c.status === 'active' ? window.t('status_confirmed') : window.t('status_cancelled')}</span>
        </div>`;
    }).join('');
  },

  _printDailyReport() {
    const today   = todayISO();
    const all     = window.mockData.bookings;
    const todayBk = all
      .filter(b => b.date === today && b.status !== 'cancelled')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const st        = window.mockData.settings || {};
    const isArabic  = (window.getCurrentLanguage?.() || 'ar') === 'ar';
    const tx        = (ar, en) => isArabic ? ar : en;
    const clubName  = st.clubName    || tx('نادي باديل برو', 'Padel Pro Club');
    const clubPhone = st.contactPhone || '';
    const esc       = window.escapeHTML || (s => s);

    const dateLabel = new Date().toLocaleDateString(window.getCurrentLocale?.() || (isArabic ? 'ar-EG' : 'en-US'), { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    // Totals
    const totalPrice    = todayBk.reduce((s, b) => s + getBookingSystemTotal(b), 0);
    const totalCollected= todayBk.reduce((s, b) => s + getPaidRevenue(b), 0);
    const totalPending  = totalPrice - totalCollected;
    const paidCount     = todayBk.filter(b => b.paymentStatus === 'paid').length;
    const partialCount  = todayBk.filter(b => b.paymentStatus === 'partial').length;
    const unpaidCount   = todayBk.filter(b => b.paymentStatus === 'unpaid').length;

    const methodMap = { cash:tx('كاش','Cash'), instapay:tx('انستا باي','Instapay'), transfer:tx('تحويل بنكي','Bank transfer'), card:tx('بطاقة','Card'), '':'—' };

    const rows = todayBk.map((b, i) => {
      const paid      = getPaidRevenue(b);
      const bookingTotal = getBookingSystemTotal(b);
      const remaining = bookingTotal - paid;
      const payLabel  = b.paymentStatus === 'paid' ? tx('مدفوع','Paid') : b.paymentStatus === 'partial' ? tx('جزئي','Partial') : tx('غير مدفوع','Unpaid');
      const payColor  = b.paymentStatus === 'paid' ? '#0F6E56' : b.paymentStatus === 'partial' ? '#D4880A' : '#C0392B';
      const bkNum     = getBookingDisplayRef(b);
      const method    = methodMap[b.paymentMethod || ''] || '—';
      return `<tr>
        <td style="text-align:center;font-weight:700;color:#555">${bkNum}</td>
        <td>${esc(b.startTime)}${b.endTime ? ' – '+esc(b.endTime) : ''}</td>
        <td>${esc(window.getCourtDisplayName ? window.getCourtDisplayName(b.courtId || b.courtName) : b.courtName)}</td>
        <td><strong>${esc(b.customerName)}</strong><br><span style="color:#888;font-size:0.78rem">${esc(window.formatPhoneDisplay ? window.formatPhoneDisplay(b.phone) : b.phone)}</span></td>
        <td style="text-align:center;font-weight:700">${formatCurrency(bookingTotal)}</td>
        <td style="text-align:center;color:#0F6E56;font-weight:700">${formatCurrency(paid)}</td>
        <td style="text-align:center;color:${remaining > 0 ? '#C0392B' : '#888'};font-weight:700">${remaining > 0 ? formatCurrency(remaining) : '—'}</td>
        <td style="text-align:center;font-size:0.8rem">${method}</td>
        <td style="text-align:center"><span style="color:${payColor};font-weight:800;font-size:0.82rem">${payLabel}</span></td>
      </tr>`;
    }).join('');

    const w = window.open('', '_blank', 'width=1000,height=800');
    w.document.write(`<!DOCTYPE html>
<html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${isArabic ? 'ar' : 'en'}">
<head>
<meta charset="UTF-8">
<title>${tx('تقرير يومي', 'Daily report')} — ${clubName} — ${today}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Tajawal', Arial, sans-serif; background: #fff; color: #1a1a2e; direction: ${isArabic ? 'rtl' : 'ltr'}; padding: 30px 40px; font-size: 13px; }

  /* Header */
  .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2.5px solid #0F6E56; }
  .club-block h1 { font-size: 1.4rem; font-weight: 900; color: #0F6E56; }
  .club-block p  { color: #666; font-size: 0.85rem; margin-top: 3px; }
  .report-tag { background: #0F6E56; color: #fff; font-weight: 800; font-size: 0.9rem; padding: 6px 18px; border-radius: 20px; }

  /* Summary cards */
  .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 22px; }
  .sum-card { border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; text-align: center; }
  .sum-val  { font-size: 1.15rem; font-weight: 900; margin-bottom: 3px; }
  .sum-lbl  { font-size: 0.75rem; color: #666; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #0F6E56; color: #fff; }
  th { padding: 9px 10px; font-weight: 700; font-size: 0.82rem; }
  td { padding: 9px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr:nth-child(even) td { background: #f9fafb; }

  /* Totals row */
  .totals-row td { background: #f0faf6 !important; font-weight: 800; border-top: 2px solid #0F6E56; }

  /* Footer */
  .report-footer { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .sign-box { border-top: 1.5px solid #1a1a2e; padding-top: 8px; text-align: center; font-size: 0.82rem; color: #555; margin-top: 40px; }

  /* Print */
  @media print {
    body { padding: 15px 20px; }
    .no-print { display: none !important; }
    @page { size: A4 landscape; margin: 15mm; }
  }
</style>
</head>
<body>

<!-- Header -->
<div class="report-header">
  <div class="club-block">
    <h1>${esc(clubName)}</h1>
    <p>${clubPhone ? esc(clubPhone) + ' • ' : ''}${tx('تقرير التحصيل اليومي', 'Daily collection report')}</p>
  </div>
  <div style="text-align:left">
    <div class="report-tag">${tx('تقرير يومي', 'Daily report')}</div>
    <div style="margin-top:8px;font-size:0.85rem;color:#555;text-align:left">${dateLabel}</div>
  </div>
</div>

<!-- Summary -->
<div class="summary-grid">
  <div class="sum-card">
    <div class="sum-val">${todayBk.length}</div>
    <div class="sum-lbl">${tx('إجمالي الحجوزات', 'Total bookings')}</div>
  </div>
  <div class="sum-card" style="border-color:#0F6E56">
    <div class="sum-val" style="color:#0F6E56">${formatCurrency(totalCollected)}</div>
    <div class="sum-lbl">${tx('المحصّل فعلياً', 'Collected')}</div>
  </div>
  <div class="sum-card" style="border-color:#C0392B">
    <div class="sum-val" style="color:#C0392B">${formatCurrency(totalPending)}</div>
    <div class="sum-lbl">${tx('المتبقي (ديون)', 'Remaining (debt)')}</div>
  </div>
  <div class="sum-card">
    <div class="sum-val" style="color:#1a1a2e">${formatCurrency(totalPrice)}</div>
    <div class="sum-lbl">${tx('إجمالي الحجوزات', 'Booking total')}</div>
  </div>
  <div class="sum-card">
    <div class="sum-val" style="font-size:0.9rem">
      <span style="color:#0F6E56">${paidCount} ${tx('مدفوع', 'Paid')}</span> •
      <span style="color:#D4880A">${partialCount} ${tx('جزئي', 'Partial')}</span> •
      <span style="color:#C0392B">${unpaidCount} ${tx('غير مدفوع', 'Unpaid')}</span>
    </div>
    <div class="sum-lbl">${tx('توزيع الدفع', 'Payment breakdown')}</div>
  </div>
</div>

<!-- Table -->
${todayBk.length === 0
  ? `<div style="text-align:center;padding:40px;color:#888">${tx('لا توجد حجوزات اليوم', 'No bookings today')}</div>`
  : `<table>
  <thead>
    <tr>
      <th>${tx('#حجز', '#')}</th><th>${tx('الوقت', 'Time')}</th><th>${tx('الملعب', 'Court')}</th><th>${tx('العميل', 'Customer')}</th>
      <th>${tx('إجمالي الحجز', 'Booking total')}</th><th>${tx('المحصّل', 'Collected')}</th><th>${tx('المتبقي', 'Remaining')}</th><th>${tx('طريقة الدفع', 'Payment method')}</th><th>${tx('الحالة', 'Status')}</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    <tr class="totals-row">
      <td colspan="4" style="text-align:right">${tx('الإجمالي', 'Total')}</td>
      <td style="text-align:center">${formatCurrency(totalPrice)}</td>
      <td style="text-align:center;color:#0F6E56">${formatCurrency(totalCollected)}</td>
      <td style="text-align:center;color:#C0392B">${totalPending > 0 ? formatCurrency(totalPending) : '—'}</td>
      <td colspan="2"></td>
    </tr>
  </tbody>
</table>`}

<!-- Signatures -->
<div class="report-footer">
  <div>
    <div class="sign-box">${tx('توقيع المسؤول المالي', 'Finance signature')}</div>
  </div>
  <div>
    <div class="sign-box">${tx('توقيع مدير النادي', 'Club manager signature')}</div>
  </div>
</div>

<div style="text-align:center;margin-top:20px;font-size:0.75rem;color:#aaa">
  ${tx('تم إنشاء هذا التقرير بتاريخ', 'This report was generated on')} ${new Date().toLocaleString(window.getCurrentLocale?.() || (isArabic ? 'ar-EG' : 'en-US'))} — ${esc(clubName)}
</div>

<!-- Print button -->
<div class="no-print" style="text-align:center;margin-top:24px">
  <button onclick="window.print()" style="background:#0F6E56;color:#fff;border:none;padding:12px 36px;border-radius:10px;font-family:'Tajawal',Arial,sans-serif;font-size:1rem;font-weight:700;cursor:pointer">
    🖨️ ${tx('طباعة التقرير', 'Print report')}
  </button>
</div>

<script>
  document.fonts.ready.then(() => setTimeout(() => window.print(), 500));
<\/script>
</body>
</html>`);
    w.document.close();
  },

  async _accept(id) {
    const b = window.mockData.bookings.find(x => x.id === id);
    if (!b) return;
    if (window.db) {
      try {
        document.querySelectorAll(`.btn-accept[onclick*="'${id}'"]`).forEach(btn => btn.disabled = true);
        const result = await window.confirmBookingWithLock?.(b.id);
        if (result?.alreadyConfirmed) {
          document.querySelectorAll(`.btn-accept[onclick*="'${id}'"]`).forEach(btn => btn.disabled = false);
          AppToast.show(dashText('هذا الحجز مؤكد بالفعل', 'This booking is already confirmed'), 'warning');
          return;
        }
        await window.syncPublicBookingSlot?.(result?.booking || { ...b, status: 'confirmed' });
        // onSnapshot will handle re-rendering
        AppToast.show(dashText('تم قبول الحجز ✓', 'Booking accepted ✓'), 'success');
      } catch (e) {
        console.error('Firestore accept error:', e);
        AppToast.show(e?.message === 'slot_already_confirmed'
          ? dashText('هذا الموعد تم تأكيده بالفعل لحجز آخر', 'This slot has already been confirmed for another booking')
          : dashText('فشل قبول الحجز — تحقق من الاتصال أو الصلاحيات', 'Failed to accept booking — check connection or permissions'), 'error');
        document.querySelectorAll(`.btn-accept[onclick*="'${id}'"]`).forEach(btn => btn.disabled = false);
      }
    } else {
      b.status = 'confirmed';
      window.mockData.save();
      this._render();
      window.renderBookingsTable?.();
      AppToast.show(dashText('تم قبول الحجز ✓', 'Booking accepted ✓'), 'success');
    }
  },

  async _reject(id) {
    const b = window.mockData.bookings.find(x => x.id === id);
    if (!b) return;
    if (window.db) {
      try {
        document.querySelectorAll(`.btn-reject[onclick*="'${id}'"]`).forEach(btn => btn.disabled = true);
        await window.db.collection('bookings').doc(b.id).update({ status: 'cancelled' });
        await window.removePublicBookingSlot?.(b.id);
        AppToast.show(dashText('تم رفض الحجز', 'Booking rejected'), 'error');
      } catch (e) {
        console.error('Firestore reject error:', e);
        AppToast.show(dashText('فشل رفض الحجز — تحقق من الاتصال أو الصلاحيات', 'Failed to reject booking — check connection or permissions'), 'error');
        document.querySelectorAll(`.btn-reject[onclick*="'${id}'"]`).forEach(btn => btn.disabled = false);
      }
    } else {
      b.status = 'cancelled';
      window.mockData.save();
      this._render();
      window.renderBookingsTable?.();
      AppToast.show(dashText('تم رفض الحجز', 'Booking rejected'), 'error');
    }
  }
};

function dashText(ar, en) {
  return (window.getCurrentLanguage?.() || 'ar') === 'ar' ? ar : en;
}

window.DashboardPage = DashboardPage;
window.renderKPIs = () => DashboardPage._render();
