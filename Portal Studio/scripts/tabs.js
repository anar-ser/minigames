const showTab = (elTabBtn) => {
  const elTab = elTabBtn.closest('.tab');
  if (elTabBtn.classList.contains('tab-link-active')) {
    return;
  }
  const targetId = elTabBtn.dataset.targetId;
  const elTabPane = elTab.querySelector(`.tab-pane[data-id="${targetId}"]`);
  if (elTabPane) {
    const elTabBtnActive = elTab.querySelector('.tab-link-active');
    elTabBtnActive.classList.remove('tab-link-active');
    const elTabPaneShow = elTab.querySelector('.tab-pane-show');
    elTabPaneShow.classList.remove('tab-pane-show');
    elTabBtn.classList.add('tab-link-active');
    elTabPane.classList.add('tab-pane-show');
  }
}

document.addEventListener('click', (e) => {
  if (e.target && !e.target.closest('.tab-link')) {
    return;
  }
  const elTabBtn = e.target.closest('.tab-link');
  showTab(elTabBtn);
});