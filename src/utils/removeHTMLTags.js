export const removeHtmlTags = (input) => {
  return input?.replace(/<[^>]*>/g, "");
};
