export const collectionPicker = "prod"; //change to prod before deploying
export const CollectionName = {
  games: collectionPicker === "prod" ? "games" : "games_old",
  proposals: collectionPicker === "prod" ? "proposals" : "proposals_old",
};
export const baseUrl =
  collectionPicker === "prod"
    ? "https://api.bd.eskoops.com"
    : "http://localhost:3001";
