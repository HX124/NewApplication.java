// ========== 密码实时验证（通用）==========
// 密码正则表达式
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$^_*#&])[a-zA-Z0-9@$^_*#&]{8,}$/;

/**
 * 初始化密码验证
 * @param {string} passwordId - 密码输入框ID
 * @param {string} passwordHintId - 密码提示框ID
 * @param {string} confirmId - 确认密码输入框ID（可选）
 * @param {string} confirmHintId - 确认密码提示框ID（可选）
 */
function initPasswordValidation(passwordId, passwordHintId, confirmId, confirmHintId) {
  const passwordInput = document.getElementById(passwordId);
  const passwordHint = document.getElementById(passwordHintId);

  if (!passwordInput || !passwordHint) return;

  // 失去焦点时验证密码
  passwordInput.addEventListener('blur', function() {
    const password = this.value.trim();

    if (password === '') {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      passwordHint.style.display = 'none';
      return;
    }

    if (!passwordRegex.test(password)) {
      this.style.borderColor = '#ff4d4f';
      passwordHint.style.display = 'block';
      passwordHint.style.color = '#ff4d4f';
      passwordHint.textContent = '❌ 密码必须包含数字、字母、特殊字符(@$^_*#&)，长度最低为8位';
    } else {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      passwordHint.style.display = 'none';
    }
  });

  // 获得焦点时隐藏提示
  passwordInput.addEventListener('focus', function() {
    this.style.borderColor = '#4fc3f7';
    passwordHint.style.display = 'none';
  });

  // 如果有确认密码框，也初始化
  if (confirmId && confirmHintId) {
    initConfirmPasswordValidation(passwordId, confirmId, confirmHintId);
  }
}

/**
 * 初始化确认密码验证
 * @param {string} passwordId - 密码输入框ID
 * @param {string} confirmId - 确认密码输入框ID
 * @param {string} confirmHintId - 确认密码提示框ID
 */
function initConfirmPasswordValidation(passwordId, confirmId, confirmHintId) {
  const passwordInput = document.getElementById(passwordId);
  const confirmInput = document.getElementById(confirmId);
  const confirmHint = document.getElementById(confirmHintId);

  if (!passwordInput || !confirmInput || !confirmHint) return;

  // 实时验证（输入时立即检查）
  confirmInput.addEventListener('input', function() {
    const password = passwordInput.value.trim();
    const confirmPassword = this.value.trim();

    if (confirmPassword === '') {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      confirmHint.style.display = 'none';
      return;
    }

    if (password !== confirmPassword) {
      this.style.borderColor = '#ff4d4f';
      confirmHint.style.display = 'block';
      confirmHint.style.color = '#ff4d4f';
      confirmHint.textContent = '❌ 两次输入的密码不一致！';
    } else {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      confirmHint.style.display = 'none';
    }
  });

  // 失去焦点时验证
  confirmInput.addEventListener('blur', function() {
    const password = passwordInput.value.trim();
    const confirmPassword = this.value.trim();

    if (confirmPassword === '') {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      confirmHint.style.display = 'none';
      return;
    }

    if (password !== confirmPassword) {
      this.style.borderColor = '#ff4d4f';
      confirmHint.style.display = 'block';
      confirmHint.style.color = '#ff4d4f';
      confirmHint.textContent = '❌ 两次输入的密码不一致！';
    } else {
      this.style.borderColor = 'rgba(76, 195, 247, 0.3)';
      confirmHint.style.display = 'none';
    }
  });

  // 获得焦点时隐藏提示
  confirmInput.addEventListener('focus', function() {
    this.style.borderColor = '#4fc3f7';
    confirmHint.style.display = 'none';
  });

  // 密码框变化时重新验证确认密码
  passwordInput.addEventListener('input', function() {
    if (confirmInput.value.trim() !== '') {
      // 触发实时验证
      const event = new Event('input');
      confirmInput.dispatchEvent(event);
    }
  });
}