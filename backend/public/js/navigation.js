const navigation = (() => {
  function goTo(page) {
    window.location.href = page;
  }

  return {
    goToLogin: () => goTo("login.html"),
    goToHome: () => goTo("home.html"),
    goToProjects: (projectId) => goTo("project.html?id=" + projectId),
  };
})();
