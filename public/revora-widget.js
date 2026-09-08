(function() {
  if (window.Revora) return;

  let sessionId = null;
  let configContext = null;
  let currentTier = 'starter';
  let workspaceKey = null;
  let selectedReasonId = "";

  // Capture script key parameter on execution mount
  const currentScript = document.currentScript || document.querySelector('script[data-revora-key]');
  if (currentScript) {
    workspaceKey = currentScript.getAttribute('data-revora-key');
  }

  // 1. GLOBAL EMBEDDABLE SDK INTERFACE
  window.Revora = {
    init: function(config) {
      if (config && config.key) workspaceKey = config.key;
    },

    open: function(config) {
      configContext = config;
      const targetKey = config.public_key || workspaceKey;
      
      if (!targetKey) {
        console.error("Revora SDK Error: Publishable identity key is missing.");
        if (config.onError) config.onError(new Error("Missing public key."));
        return;
      }

      // Liquid initialization request hitting local authenticated service layers
      fetch('http://localhost:3000/api/v1/cancellation/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${targetKey}`
        },
        body: JSON.stringify({
          external_customer_id: config.external_customer_id,
          external_subscription_id: config.subscription_id,
          email: config.email,
          name: config.name
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Gateway handshake failed.");
        return res.json();
      })
      .then(data => {
        sessionId = data.session_id;
        
        // Safely capture flow configuration parameters from database context
        const dbConfig = data.flow?.trigger_config || {};
        currentTier = dbConfig.show_attribution_badge ? 'starter' : 'pro';
        
        // Binds your entire database flow schema options directly to the active widget layout memory
        configContext.flow_config = dbConfig;
        
        initializeLiquidUI(currentTier);
      })
      .catch(err => {
        console.error("Revora Engine Failure Loop Intercept:", err);
        if (config.onError) config.onError(err);
        window.Revora.close();
      });
    },

    close: function() {
      const widgetRoot = document.getElementById('revora-widget-root');
      if (widgetRoot) widgetRoot.remove();
    }
  };

  function initializeLiquidUI(tier) {
    const host = document.createElement('div');
    host.id = 'revora-widget-root';
    host.style.position = 'fixed';
    host.style.inset = '0';
    host.style.zIndex = '2147483647';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'closed' });
    
    // Expose private reference tracker to bypass closed element barriers safely after shadow is instantiated
    host._shadowRootReference = shadow;

    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .r-backdrop {
        position: absolute; inset: 0;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; will-change: opacity;
        animation: rWaterFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .r-modal {
        background: #F8FAFC; border: 1px solid rgba(15, 23, 42, 0.08);
        color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        width: 100%; max-width: 380px; padding: 36px; border-radius: 20px;
        box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.12), 0 12px 24px -4px rgba(15, 23, 42, 0.04);
        transform: scale(0.96) translateY(4px); opacity: 0; will-change: transform, opacity;
        animation: rWaterFlow 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .r-title { font-size: 19px; font-weight: 800; tracking: -0.02em; margin: 0 0 6px 0; color: #0F172A; }
      .r-desc { font-size: 13px; color: #475569; margin: 0 0 24px 0; line-height: 1.5; }
      .r-row {
        display: flex; align-items: center; justify-content: space-between;
        background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.06);
        padding: 14px 18px; border-radius: 12px; margin-bottom: 8px;
        cursor: pointer; font-size: 13.5px; font-weight: 600; color: #334155;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .r-row:hover {
        border-color: #0F8F83; color: #0F172A; background: #ffffff;
        transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
      }
      .r-chevron {
        width: 12px; height: 12px; color: #94a3b8; opacity: 0.8;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s;
        will-change: transform;
      }
      .r-row:hover .r-chevron {
        color: #0F8F83;
        transform: translateX(3px);
      }
      .r-input {
        width: 100%; height: 40px; background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 10px;
        padding: 0 14px; font-size: 13px; color: #0F172A; outline: none;
        box-sizing: border-box; transition: all 0.2s;
      }
      .r-input:focus { border-color: #0F8F83; box-shadow: 0 0 0 3px rgba(15, 143, 131, 0.12); }
      .r-btn {
        width: 100%; height: 40px; display: flex; align-items: center; justify-content: center;
        border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;
      }
      .r-btn-teal { background: #0F8F83; color: #ffffff; border: none; }
      .r-btn-teal:hover { background: #0c776e; transform: translateY(-1px); }
      .r-btn-midnight { background: #0F172A; color: #F8FAFC; border: none; margin-top: 12px; }
      .r-btn-midnight:hover { background: #1e293b; transform: translateY(-1px); }
      .r-btn-ghost { background: transparent; color: #64748b; border: 1px solid rgba(15, 23, 42, 0.08); margin-top: 8px; }
      .r-btn-ghost:hover { color: #0F172A; background: rgba(15, 23, 42, 0.02); }
      .r-footer { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 28px; border-t: 1px solid rgba(15, 23, 42, 0.05); pt-4; }
      .r-footer-text { font-size: 8px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
      .r-footer-brand { font-size: 11px; font-weight: 800; color: #475569; text-decoration: none; }
      @keyframes rWaterFade { to { opacity: 1; } }
      @keyframes rWaterFlow { to { opacity: 1; transform: scale(1) translateY(0); } }

      /* ELITE STRIPE-GRADE MOBILE PHONE RESPONSIVE OVERLAY */
      @media (max-width: 480px) {
        .r-backdrop {
          align-items: flex-end;
        }
        .r-modal {
          max-width: 100% !important;
          width: 100vw !important;
          padding: 32px 24px 44px 24px !important;
          border-radius: 24px 24px 0 0 !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: none !important;
          transform: translateY(100%);
          animation: rMobileSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          box-shadow: 0 -20px 40px -12px rgba(15, 23, 42, 0.08);
        }
        .r-title { font-size: 20px !important; }
        .r-desc { font-size: 13.5px !important; }
        .r-row { padding: 16px 18px !important; }
        .r-btn { height: 44px !important; }
      }
      @keyframes rMobileSlideUp {
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    shadow.appendChild(styleTag);

    const backdrop = document.createElement('div');
    backdrop.className = 'r-backdrop';
    shadow.appendChild(backdrop);

    renderStepNode(backdrop, 'survey');
  }

  function renderStepNode(backdrop, stepType) {
    let modal = backdrop.querySelector('.r-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'r-modal';
      backdrop.appendChild(modal);
    }

    // 1. EXIT SURVEY CHANNEL SELECTION
    if (stepType === 'survey') {
      modal.innerHTML = `
        <h3 class="r-title">Before you go...</h3>
        <p class="r-desc">We'd love to keep you with us. Why are you cancelling your subscription?</p>
        <div id="r-options-box"></div>
      `;

      const box = modal.querySelector('#r-options-box');
      const allChoices = [
        { id: 'too_expensive', label: 'Too expensive' },
        { id: 'missing_feature', label: 'Missing a feature' },
        { id: 'not_using_enough', label: 'Not using it enough' },
        { id: 'switching_competitor', label: 'Switching to competitor' },
        { id: 'other', label: 'Other' }
      ];

      const activeChoices = currentTier === 'starter' 
        ? allChoices.filter(c => c.id === 'too_expensive' || c.id === 'other' || c.id === 'missing_feature')
        : allChoices;

      activeChoices.forEach(choice => {
        const row = document.createElement('div');
        row.className = 'r-row';
        row.innerHTML = `
          <span>${choice.label}</span>
          <svg width="14" height="14" class="r-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        `;
        row.onclick = () => {
          selectedReasonId = choice.id;
          renderStepNode(backdrop, choice.id);
        };
        box.appendChild(row);
      });

      if (currentTier === 'starter') {
        const footer = document.createElement('div');
        footer.className = 'r-footer';
        footer.innerHTML = `
          <span class="r-footer-text">Powered by</span>
          <a href="https://vercel.app" target="_blank" rel="noopener noreferrer" class="r-footer-brand">Revora</a>
        `;
        modal.appendChild(footer);
      }
    }

    // 2. STRATEGY 1: TOO EXPENSIVE -> DYNAMIC VALUED COUPON SYSTEM INTERCEPTOR
    if (stepType === 'too_expensive') {
      // Safely dig into your live database configuration layer payload
      const strategies = configContext?.flow_config?.strategies?.too_expensive || {};
      const customDiscount = strategies.discount_percentage || 20; // Fallback to 20 if empty
      const customMonths = strategies.duration_months || 3;       // Fallback to 3 months if empty

      modal.innerHTML = `
        <h3 class="r-title">We can help with that.</h3>
        <p class="r-desc">Enjoy the exact same features at a lower rate. Get ${customDiscount}% off for the next ${customMonths} ${customMonths === 1 ? 'month' : 'months'}.</p>
        <button id="revora-accept-discount" class="r-btn r-btn-teal">Claim ${customDiscount}% Discount</button>
        <button id="r-decline-flow" class="r-btn r-btn-ghost">Continue Cancellation</button>
      `;
      backdrop.appendChild(modal);

      modal.querySelector('#revora-accept-discount').onclick = () => finalizeSession('offer_accepted', { coupon: `${customDiscount}_OFF_${customMonths}MO` }, 'session_rescue_success');
      modal.querySelector('#r-decline-flow').onclick = () => finalizeSession('cancelled', { reason: 'too_expensive_declined' }, 'session_churn_finalized');
    }

    // Dynamic keystroke validator configuration utility
    function setupValidatedInput(inputEl, buttonEl, onValidSubmit) {
      const validate = () => {
        const cleanVal = inputEl.value.trim();
        if (cleanVal.length >= 1) {
          buttonEl.removeAttribute('disabled');
          buttonEl.style.opacity = '1';
          buttonEl.style.cursor = 'pointer';
          return true;
        } else {
          buttonEl.setAttribute('disabled', 'true');
          buttonEl.style.opacity = '0.4';
          buttonEl.style.cursor = 'not-allowed';
          return false;
        }
      };
      
      validate();
      inputEl.addEventListener('input', validate);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (validate()) onValidSubmit(inputEl.value.trim());
        }
      });
      buttonEl.onclick = () => {
        if (validate()) onValidSubmit(inputEl.value.trim());
      };
    }
    // 3. STRATEGY 2: MISSING FEATURE -> TEXTBOX MATRIX
    if (stepType === 'missing_feature') {
      modal.innerHTML = `
        <h3 class="r-title">We're shipping daily.</h3>
        <p class="r-desc">What feature are you missing? We can add it to our development roadmap.</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <input type="text" id="r-feature-input" class="r-input" placeholder="e.g. Real-time webhooks, advanced filters..." />
          <button id="revora-submit-feature" class="r-btn r-btn-midnight">Request Feature & Stay</button>
          <button id="r-decline-flow" class="r-btn r-btn-ghost">Skip & Cancel</button>
        </div>
      `;
      backdrop.appendChild(modal);

      const input = modal.querySelector('#r-feature-input');
      const submitBtn = modal.querySelector('#revora-submit-feature');
      setupValidatedInput(input, submitBtn, (val) => {
        finalizeSession('offer_accepted', { waitlist_feature: val }, 'session_rescue_success');
      });

      modal.querySelector('#r-decline-flow').onclick = () => finalizeSession('cancelled', { reason: 'missing_feature_skipped' }, 'session_churn_finalized');
    }

    // 4. STRATEGY 3: NOT USING IT ENOUGH -> DYNAMIC FREEZE MATRIX
    if (stepType === 'not_using_enough') {
      // Safely dig into your live database configuration layer payload
      const strategies = configContext?.flow_config?.strategies?.not_using_enough || {};
      const customPause = strategies.pause_duration_months || 3; // Fallback to 3 months if empty

      modal.innerHTML = `
        <h3 class="r-title">Pause your subscription.</h3>
        <p class="r-desc">Pause your billing safely for ${customPause} ${customPause === 1 ? 'month' : 'months'}. Your data and account history will be right here when you get back.</p>
        <button id="revora-pause-sub" class="r-btn r-btn-teal">Pause for ${customPause} ${customPause === 1 ? 'Month' : 'Months'}</button>
        <button id="r-decline-flow" class="r-btn r-btn-ghost">No thanks, cancel access</button>
      `;
      backdrop.appendChild(modal);

      modal.querySelector('#revora-pause-sub').onclick = () => finalizeSession('offer_accepted', { pause_duration: `${customPause}_months` }, 'session_rescue_success');
      modal.querySelector('#r-decline-flow').onclick = () => finalizeSession('cancelled', { reason: 'pause_declined' }, 'session_churn_finalized');
    }

    // 5. STRATEGY 4: SWITCHING COMPETITOR -> TEXTBOX MATCHING
    if (stepType === 'switching_competitor') {
      modal.innerHTML = `
        <h3 class="r-title">Wait — let us earn it.</h3>
        <p class="r-desc">Switching to an alternative? Let us know who you're considering and we'll see if we can match their offering.</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <input type="text" id="r-match-input" class="r-input" placeholder="Enter alternative competitor name..." />
          <button id="revora-claim-match" class="r-btn r-btn-midnight">Request Match & Stay</button>
          <button id="r-decline-flow" class="r-btn r-btn-ghost">Continue Cancellation</button>
        </div>
      `;
      backdrop.appendChild(modal);

      const input = modal.querySelector('#r-match-input');
      const submitBtn = modal.querySelector('#revora-claim-match');
      setupValidatedInput(input, submitBtn, (val) => {
        finalizeSession('offer_accepted', { target_competitor: val }, 'session_rescue_success');
      });

      modal.querySelector('#r-decline-flow').onclick = () => finalizeSession('cancelled', { reason: 'competitor_match_skipped' }, 'session_churn_finalized');
    }

    // 6. STRATEGY 5: OTHER -> TEXTAREA FEEDBOX MATRIX
    if (stepType === 'other') {
      modal.innerHTML = `
        <h3 class="r-title">Tell us what happened.</h3>
        <p class="r-desc">How can we improve? Let us know what we could have done better.</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <textarea id="r-feed-text" class="r-input" style="height: 72px; padding: 10px; resize: none;" placeholder="Share your suggestions with us..."></textarea>
          <button id="revora-submit-feedback" class="r-btn r-btn-midnight">Submit Feedback & Stay</button>
          <button id="r-decline-flow" class="r-btn r-btn-ghost">Cancel Account Immediately</button>
        </div>
      `;
      backdrop.appendChild(modal);

      const input = modal.querySelector('#r-feed-text');
      const submitBtn = modal.querySelector('#revora-submit-feedback');
      setupValidatedInput(input, submitBtn, (val) => {
        finalizeSession('offer_accepted', { open_feedback: val }, 'session_rescue_success');
      });

      modal.querySelector('#r-decline-flow').onclick = () => finalizeSession('cancelled', { reason: 'other_text_skipped' }, 'session_churn_finalized');
    }

    // 7. HIGH-FIDELITY LIQUID SCREEN TRANSITIONS FOR CONFIRMATION (CLEAN & CENTER-LOCKED)
    if (stepType === 'confirmation_success') {
      modal.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <div style="background: rgba(15, 143, 131, 0.1); color: #0F8F83; font-size: 24px; font-weight: bold; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">✓</div>
          <h3 class="r-title">Subscription Secured</h3>
          <p class="r-desc" style="margin-bottom: 0;">Your account states have updated successfully. Thank you for staying with us!</p>
        </div>
      `;
      setTimeout(() => window.Revora.close(), 2500);
    }

    if (stepType === 'confirmation_cancelled') {
      modal.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <div style="background: rgba(71, 85, 105, 0.1); color: #475569; font-size: 20px; font-weight: bold; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">✕</div>
          <h3 class="r-title">Cancellation Processed</h3>
          <p class="r-desc" style="margin-bottom: 0;">Your subscription has been safely turned off. Your workspace access remains active until the end of your billing cycle.</p>
        </div>
      `;
      setTimeout(() => window.Revora.close(), 3000);
    }
  }

  // 8. ATOMIC TELEMETRY DISPATCH MATRIX (FIXED LOCAL VARIABLE RETENTION BRIDGE)
  function finalizeSession(outcome, properties, eventType) {
    if (!sessionId || !configContext) {
      window.Revora.close();
      return;
    }

    const targetKey = configContext.public_key || workspaceKey;
    const hostNode = document.getElementById('revora-widget-root');
    const backdropRoot = hostNode ? hostNode._shadowRootReference : null;
    
    // Save the intended view parameter inside a local scope string variable immediately
    const intendedNextView = outcome === 'offer_accepted' ? 'confirmation_success' : 'confirmation_cancelled';

    if (backdropRoot) {
      // BLOCK SPAM CLICKS IMMEDIATELY: Injects a clear overlay to trap inputs instantly
      const blockOverlay = document.createElement('div');
      blockOverlay.style.position = 'absolute';
      blockOverlay.style.inset = '0';
      blockOverlay.style.zIndex = '999999';
      blockOverlay.style.cursor = 'not-allowed';
      
      const targetModal = backdropRoot.querySelector('.r-modal');
      if (targetModal) targetModal.appendChild(blockOverlay);
    }

    // Fire the network telemetry update straight to Next.js API Routes
    fetch(`http://localhost:3000/api/v1/cancellation/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${targetKey}`
      },
      body: JSON.stringify({
        status: 'completed',
        outcome: outcome,
        metadata: properties,
        event_type: eventType,
        event_properties: properties
      })
    })
    .then(() => {
      // LIQUID WAVE TRANSITION: Leverages the securely stored local view string to lock center coordinates
      if (backdropRoot) {
        renderStepNode(backdropRoot, intendedNextView);
      }
      
      if (configContext && configContext.onClose) {
        configContext.onClose({ outcome: outcome });
      }
    })
    .catch(() => {
      window.Revora.close();
    });
  }
})();
