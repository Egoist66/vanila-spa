export const useChangeName = () => {
  const button = document.getElementById("change-name");

  function changeRandomName(userStore) {
    userStore.name = Math.random().toString(36).slice(2);
  }

  return {
    button,
    changeRandomName,
  };
};
