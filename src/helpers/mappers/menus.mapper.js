export default (el) => {
  return {
    id: el.id_menu,
    name: el.web_label,
    image: el.image,
    ...el,
  };
};
