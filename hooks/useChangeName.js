export const useChangeName = () => {
  const button = document.getElementById("change-name");

  function changeRandomName(user = {}) {
    user.name = Math.random().toString(36).substring(7);
  }

  return {
    button,
    changeRandomName,
  };
};
