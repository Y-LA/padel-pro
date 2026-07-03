/* ===========================
   PADEL PRO — courts.js
   SPA Module — Courts grid + daily booking slots
=========================== */

const CourtsPage = {
  _ready:     false,
  _editingId: null,
  _dayOffset: 0,   // 0 = today, -1 = yesterday, +1 = tomorrow

  // ─── SPA Entry Point ──────────────────────────────────────────────
  init() {
    this._renderGrid();
    this._renderDailySlots();
    if (!this._ready) {
      this._attachListeners();
      this._ready = true;
    }
  },

  // ─── Attach Listeners (ONCE) ─────────────────────────────────────
  _attachListeners() {
    // Add court button
    document.getElementById('add-court-btn')
      .addEventListener('click', () => this._openAddModal());

    // Add block button
    document.getElementById('add-block-btn')
      ?.addEventListener('click', () => this._openBlockModal());

    // Save court button
    document.getElementById('save-court-btn')
      .addEventListener('click', () => this._handleSave());

    // Save block button
    document.getElementById('save-block-btn')
      ?.addEventListener('click', () => this._saveBlock());

    // Courts grid — event delegation
    document.getElementById('courts-grid').addEventListener('click', e => {
      const edit   = e.target.closest('[data-action="edit"]');
      const del    = e.target.closest('[data-action="delete"]');
      const block  = e.target.closest('[data-action="block"]');
      if (edit)  this._openEditModal(edit.dataset.id);
      if (del)   this._handleDelete(del.dataset.id);
      if (block) this._openBlockModal(block.dataset.id);
    });

    // Blocks list — delete block
    document.getElementById('blocks-list')
      ?.addEventListener('click', e => {
        const del = e.target.closest('[data-action="del-block"]');
        if (del) this._deleteBlock(del.dataset.id);
      });

    // Day navigation
    document.getElementById('prev-day-btn')?.addEventListener('click', () => {
      this._dayOffset--;
      this._renderDailySlots();
    });
    document.getElementById('next-day-btn')?.addEventListener('click', () => {
      this._dayOffset++;
      this._renderDailySlots();
    });
    document.getElementById('today-btn')?.addEventListener('click', () => {
      this._dayOffset = 0;
      this._renderDailySlots();
    });

    // Slots grid — click available slot to pre-fill booking
    document.getElementById('slots-grid').addEventListener('click', e => {
      const slot = e.target.closest('.slot-available');
      if (!slot) return;
      sessionStorage.setItem('prefillBooking', JSON.stringify({
        courtId: slot.dataset.court,
        date:    slot.dataset.date,
        time:    slot.dataset.time
      }));
      navigateTo('bookings');
    });

  },

  // ─── Courts Grid ──────────────────────────────────────────────────
  _renderGrid() {
    const grid  = document.getElementById('courts-grid');
    const today = todayISO();
    const courts = window.mockData.courts;

    if (courts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="18" rx="2"/>
              <line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
            <p>${window.t('noCourts')}</p>
            <small>${window.t('addCourtToStart')}</small>
          </div>
        </div>`;
      return;
    }

    const SPORT_LABELS = { padel: window.t('sport_padel'), tennis: window.t('sport_tennis'), squash: window.t('sport_squash') };
    const SPORT_ICONS  = {
      padel:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18" stroke-opacity="0.5"/><ellipse cx="12" cy="12" rx="5" ry="9" stroke-opacity="0.7"/></svg>`,
      tennis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M5.2 5.2A10 10 0 0118.8 18.8"/><path d="M18.8 5.2A10 10 0 015.2 18.8"/></svg>`,
      squash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`
    };

    grid.innerHTML = courts.map((court, idx) => {
      const todayBookings = window.mockData.bookings.filter(b =>
        b.courtId === court.id && b.date === today && b.status !== 'cancelled'
      ).length;
      const totalConfirmed = window.mockData.bookings.filter(b =>
        b.courtId === court.id && b.status === 'confirmed'
      ).length;

      const sportLabel  = SPORT_LABELS[court.sport] || court.sport;
      const sportIcon   = SPORT_ICONS[court.sport] || SPORT_ICONS.padel;
      const statusBadge = court.status === 'active'
        ? `<span class="badge badge-confirmed">${window.t('status_active')}</span>`
        : `<span class="badge badge-cancelled">${window.t('status_inactive')}</span>`;

      let img = court.imageUrl || '';
      // Fallback for local index-based images if no imageUrl set
      const localCourtImgs = [
        'assets/courts/court1.png',
        'assets/courts/court2.png',
        'assets/courts/court3.png',
        'assets/courts/court4.png'
      ];
      if (!img) img = localCourtImgs[idx % localCourtImgs.length];

      const hasImg = img && img.trim() !== '';

      return `
        <div class="court-card" data-id="${court.id}">
          <div class="court-card-header ${court.sport}" ${hasImg ? `style="background-image:url('${img}'); background-size:cover; background-position:center;"` : ''}>
            ${hasImg ? '' : sportIcon}
          </div>
          <div class="court-card-body">
            <div class="court-card-top">
              <div class="court-name">${window.getCourtDisplayName ? window.getCourtDisplayName(court) : court.name}</div>
              ${statusBadge}
            </div>
            <div class="court-meta">
              <div class="court-meta-row">${sportIcon}<span>${sportLabel}</span></div>
              <div class="court-meta-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                <span>${court.surface}</span>
              </div>
              <div class="court-meta-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                <span><strong>${formatCurrency(court.pricePerHour)}</strong> / hr</span>
              </div>
            </div>
            <div class="court-stats">
              <div class="court-stat">
                <div class="court-stat-value">${todayBookings}</div>
                <div class="court-stat-label">${window.t('todayBookings')}</div>
              </div>
              <div class="court-stat">
                <div class="court-stat-value">${totalConfirmed}</div>
                <div class="court-stat-label">${window.t('totalConfirmedAll')}</div>
              </div>
            </div>
          </div>
          <div class="court-card-actions">
            <button class="btn btn-outline btn-sm" data-action="edit" data-id="${court.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              ${window.t('edit')}
            </button>
            <button class="btn btn-sm" style="background:var(--amber-light,#fff8e1);color:var(--amber,#f59e0b);border:1px solid rgba(245,158,11,0.3)"
              data-action="block" data-id="${court.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              ${window.t('temporaryBlock')}
            </button>
            <button class="btn btn-sm" style="background:var(--red-light);color:var(--red);border:1px solid rgba(163,45,45,0.2)"
              data-action="delete" data-id="${court.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              ${window.t('delete')}
            </button>
          </div>
        </div>`;
    }).join('');
  },

  // ─── Daily Slots View ─────────────────────────────────────────────
  _renderDailySlots() {
    const grid     = document.getElementById('slots-grid');
    const dayLabel = document.getElementById('day-label') || document.getElementById('week-label');
    if (!grid || !dayLabel) return;

    // Compute selected date
    const d = new Date();
    d.setDate(d.getDate() + this._dayOffset);
    const selectedDate = d.toISOString().slice(0, 10);

    // Update label
    dayLabel.textContent = window.formatAppDate(d, {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });

    const courts      = window.mockData.courts;
    const bookings    = window.mockData.bookings;
    const courtBlocks = window.mockData.courtBlocks || [];

    if (courts.length === 0) {
      grid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-secondary);font-size:0.9rem;">${window.t('noCourtsYet')}</div>`;
      return;
    }

    // Build 30-min time slots dynamically based on settings
    const timeSlots = window.getAllTimeSlots ? window.getAllTimeSlots() : (() => {
      const s = [];
      for (let h = 6; h < 24; h++) { s.push(`${String(h).padStart(2,'0')}:00`); s.push(`${String(h).padStart(2,'0')}:30`); }
      return s;
    })();

    // Set grid column template dynamically
    const timeColWidth = window.innerWidth <= 480 ? 58 : window.innerWidth <= 768 ? 64 : 72;
    const courtColWidth = window.innerWidth <= 480 ? 92 : window.innerWidth <= 768 ? 108 : 130;
    grid.style.gridTemplateColumns = `${timeColWidth}px repeat(${courts.length}, minmax(${courtColWidth}px, 1fr))`;
    grid.style.minWidth = `${timeColWidth + courts.length * courtColWidth}px`;

    const now = new Date();
    let html  = '';

    // Header row: empty label + court names
    html += `<div class="slot-header-cell" style="background:transparent"></div>`;
    courts.forEach(c => {
      html += `<div class="slot-header-cell">${window.getCourtDisplayName ? window.getCourtDisplayName(c) : c.name}</div>`;
    });

    // Time rows
    timeSlots.forEach(time => {
      const isHour = time.endsWith(':00');
      html += `<div class="slot-time-cell ${isHour ? '' : 'slot-time-half'}">${time}</div>`;

      courts.forEach(c => {
        const booking = bookings.find(b =>
          b.courtId === c.id &&
          b.date    === selectedDate &&
          b.status  !== 'cancelled' &&
          this._slotCovered(b, time)
        );

        const block = courtBlocks.find(bl =>
          bl.courtId === c.id && bl.date === selectedDate &&
          time >= bl.startTime && time < bl.endTime
        );

        if (booking) {
          const shortName = booking.customerName.split(' ')[0];
          const isStart   = booking.startTime === time;
          const accentClr = booking.status === 'confirmed' ? 'var(--primary)' : 'var(--amber)';
          html += `
            <div class="slot-cell slot-booked"
              style="border-right:3px solid ${accentClr}"
              title="${booking.customerName} — ${booking.startTime}–${booking.endTime || ''} (${getStatusLabel(booking.status)})">
              ${isStart ? `<span class="slot-name">${shortName}</span>` : ''}
            </div>`;
        } else if (block) {
          const isStart = block.startTime === time;
          html += `<div class="slot-cell slot-blocked" title="${window.t('blocked')}: ${block.reason || window.t('temporarilyBlocked')} (${block.startTime}–${block.endTime})">
            ${isStart ? `<span class="slot-name" style="font-size:0.7rem">${block.reason || window.t('blocked')}</span>` : ''}
          </div>`;
        } else if (c.status !== 'active') {
          html += `<div class="slot-cell slot-inactive" title="${window.t('courtClosed')}"><span style="text-decoration:line-through;color:var(--delete)">${time}</span></div>`;
        } else {
          const slotDt = new Date(`${selectedDate}T${time}`);
          const isPast  = slotDt < now;
          if (isPast) {
            html += `<div class="slot-cell slot-past"></div>`;
          } else {
            html += `<div class="slot-cell slot-available"
              data-date="${selectedDate}"
              data-time="${time}"
              data-court="${c.id}"
              title="${window.t('availableClickToBook')}">+</div>`;
          }
        }
      });
    });

    grid.innerHTML = html;
    this._renderBlocksList();
  },

  // Does a booking cover the given 30-min slot?
  _slotCovered(booking, slotTime) {
    const start = booking.startTime;
    const end   = booking.endTime;
    if (!end) return start === slotTime;
    return slotTime >= start && slotTime < end;
  },

  // ─── Court CRUD ───────────────────────────────────────────────────
  _openAddModal() {
    this._editingId = null;
    document.getElementById('court-modal-title').textContent = window.t('addNewCourt');
    document.getElementById('court-form').reset();
    openModal('court-modal');
  },

  _openEditModal(id) {
    const court = window.mockData.courts.find(c => c.id === id);
    if (!court) return;
    this._editingId = id;
    document.getElementById('court-modal-title').textContent     = window.t('editCourt');
    document.getElementById('court-name-input').value            = court.name;
    document.getElementById('court-sport-input').value           = court.sport;
    document.getElementById('court-surface-input').value         = court.surface;
    document.getElementById('court-price-input').value           = court.pricePerHour;
    document.getElementById('court-status-input').value          = court.status;
    // Populate image fields
    const presets = ['assets/courts/court1.png','assets/courts/court2.png','assets/courts/court3.png','assets/courts/court4.png'];
    const imgSel = document.getElementById('court-image-input');
    const imgUrl = document.getElementById('court-image-url-input');
    if (imgSel && imgUrl) {
      if (presets.includes(court.imageUrl)) { imgSel.value = court.imageUrl; imgUrl.value = ''; }
      else { imgSel.value = ''; imgUrl.value = court.imageUrl || ''; }
    }
    openModal('court-modal');
  },

  _handleSave() {
    const form = document.getElementById('court-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const name     = document.getElementById('court-name-input').value.trim();
    const sport    = document.getElementById('court-sport-input').value;
    const surface  = document.getElementById('court-surface-input').value;
    const price    = parseFloat(document.getElementById('court-price-input').value) || 0;
    const status   = document.getElementById('court-status-input').value;
    // Image: custom URL overrides dropdown selection
    const imgSel   = document.getElementById('court-image-input')?.value || '';
    const imgUrl   = document.getElementById('court-image-url-input')?.value.trim() || '';
    const imageUrl = imgUrl || imgSel || '';

    if (this._editingId) {
      const court = window.mockData.courts.find(c => c.id === this._editingId);
      if (court) {
        court.name         = name;
        court.sport        = sport;
        court.surface      = surface;
        court.pricePerHour = price;
        court.status       = status;
        court.imageUrl     = imageUrl;
        window.mockData.bookings.forEach(b => {
          if (b.courtId === this._editingId) b.courtName = name;
        });
        window.mockData.saveCourt(court);
      }
      AppToast.show(window.t('courtUpdated'), 'success');
    } else {
      const newCourt = { id: generateId('C'), name, sport, surface, pricePerHour: price, status, imageUrl };
      window.mockData.saveCourt(newCourt);
      AppToast.show(window.t('courtAdded'), 'success');
    }
    closeModal('court-modal');
    this._renderGrid();
    this._renderDailySlots();
  },

  _handleDelete(id) {
    const court = window.mockData.courts.find(c => c.id === id);
    if (!court) return;

    // Use custom confirm modal
      const modal = document.getElementById('confirm-delete-modal');
    if (modal) {
      document.getElementById('confirm-delete-msg').textContent =
        window.t('deleteCourtConfirm', { name: court.name });
      openModal('confirm-delete-modal');
      const confirmBtn = document.getElementById('confirm-delete-yes');
      // Clone to remove old listeners
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
      newBtn.addEventListener('click', () => {
        this._doDelete(id, court.name);
        closeModal('confirm-delete-modal');
      });
    } else {
      // Fallback
      if (confirm(window.t('deleteCourtConfirm', { name: court.name }))) this._doDelete(id, court.name);
    }
  },

  _doDelete(id, courtName) {
    window.mockData.bookings = window.mockData.bookings.filter(b => b.courtId !== id);
    window.mockData.deleteCourt(id);
    this._renderGrid();
    this._renderDailySlots();
    AppToast.show(window.t('courtDeleted', { name: courtName }), 'warning');
  },

  // ─── Court Blocks ─────────────────────────────────────────────────
  _openBlockModal(courtId) {
    // Reset form
    const form = document.getElementById('block-form');
    if (form) form.reset();

    // Populate courts
    const courtSel = document.getElementById('block-court-input');
    if (courtSel) {
      const courts = window.mockData.courts.filter(c => c.status === 'active');
      courtSel.innerHTML = courts.map(c =>
        `<option value="${c.id}" ${c.id === courtId ? 'selected' : ''}>${window.getCourtDisplayName ? window.getCourtDisplayName(c) : c.name}</option>`
      ).join('');
    }

    // Populate time slots
    const timeSlots = window.getAllTimeSlots ? window.getAllTimeSlots() : (() => {
      const s = [];
      for (let h = 6; h < 24; h++) {
        s.push(`${String(h).padStart(2,'0')}:00`);
        s.push(`${String(h).padStart(2,'0')}:30`);
      }
      return s;
    })();
    // Add 24:00 as end option
    const endSlots = [...timeSlots, '24:00'];

    const startSel = document.getElementById('block-start-input');
    const endSel   = document.getElementById('block-end-input');
    if (startSel) startSel.innerHTML = timeSlots.map(t => `<option value="${t}">${t}</option>`).join('');
    if (endSel)   endSel.innerHTML   = endSlots.map(t => `<option value="${t}">${t}</option>`).join('');

    // Default date to currently viewed day
    const d = new Date();
    d.setDate(d.getDate() + this._dayOffset);
    const dateEl = document.getElementById('block-date-input');
    if (dateEl) dateEl.value = d.toISOString().slice(0, 10);

    openModal('block-modal');
  },

  _saveBlock() {
    const courtId   = document.getElementById('block-court-input')?.value;
    const date      = document.getElementById('block-date-input')?.value;
    const startTime = document.getElementById('block-start-input')?.value;
    const endTime   = document.getElementById('block-end-input')?.value;
    const reason    = document.getElementById('block-reason-input')?.value?.trim() || window.t('temporarilyBlocked');

    if (!courtId || !date || !startTime || !endTime) {
      AppToast.show(window.t('fillRequiredFields'), 'error');
      return;
    }
    if (startTime >= endTime) {
      AppToast.show(window.t('startBeforeEnd'), 'error');
      return;
    }

    const court = window.mockData.courts.find(c => c.id === courtId);
    const block = {
      id:         generateId('CB'),
      courtId,
      courtName:  window.getCourtDisplayName ? window.getCourtDisplayName(court) : (court?.name || ''),
      date,
      startTime,
      endTime,
      reason,
      createdAt:  new Date().toISOString()
    };

    window.mockData.addCourtBlock(block);
    closeModal('block-modal');
    AppToast.show(
      window.t('blockSaved', {
        name: window.getCourtDisplayName ? window.getCourtDisplayName(court) : (court?.name || ''),
        start: startTime,
        end: endTime
      }),
      'success'
    );
    this._renderDailySlots();
  },

  _deleteBlock(id) {
    window.mockData.removeCourtBlock(id);
    AppToast.show(window.t('blockDeleted'), 'success');
    this._renderDailySlots();
  },

  _renderBlocksList() {
    const el = document.getElementById('blocks-list');
    if (!el) return;
    const titleEl = document.getElementById('blocks-today-title');
    if (titleEl) {
      titleEl.innerHTML = `${titleEl.querySelector('svg')?.outerHTML || ''} ${window.t('temporaryBlocksToday')}`;
    }

    // Compute selected date
    const d = new Date();
    d.setDate(d.getDate() + this._dayOffset);
    const selectedDate = d.toISOString().slice(0, 10);

    const blocks = (window.mockData.courtBlocks || [])
      .filter(bl => bl.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!blocks.length) {
      el.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;margin:0">${window.t('noBlocksToday')}</p>`;
      return;
    }

    el.innerHTML = blocks.map(bl => `
      <div class="block-item">
        <div class="block-item-info">
          <span class="block-court-tag">${window.getCourtDisplayName ? window.getCourtDisplayName(bl.courtId || bl.courtName) : bl.courtName}</span>
          <span class="block-time">${bl.startTime} – ${bl.endTime}</span>
          <span class="block-reason">${bl.reason}</span>
        </div>
        <button class="btn btn-sm" style="background:var(--red-light);color:var(--red);border:none;padding:4px 10px"
          data-action="del-block" data-id="${bl.id}" title="${window.t('deleteBlockTitle')}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </button>
      </div>`).join('');
  }
};

// Helper: check if a slot is blocked (used by bookings wizard)
window.isBlockedSlot = function(courtId, date, slotTime) {
  return (window.mockData.courtBlocks || []).some(bl =>
    bl.courtId === courtId && bl.date === date &&
    slotTime >= bl.startTime && slotTime < bl.endTime
  );
};

window.CourtsPage = CourtsPage;
