// One place that turns the Create Activity form into the Firestore document (used by Save Draft and Submit)
import { collection, getFirestore, addDoc, doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import store from "../../redux/store";
import { CollectionName } from "../collection_config";
import { fire } from "../../components/Firebase";
import { pushToFBStorage } from "./utils";

export async function saveActivity({ draft }) {
  const db = getFirestore(fire);
  const groupedURLs = await pushToFBStorage();
  const s = store.getState().createActivity;
  const { welcomeSlide, descriptionData, objectivePoints, outcomes, programModules } = s;
  const isProgram = s.format === "program";
  const finalData = {
    game_name: s.game_name ?? "",
    game_name_small: s.game_name?.toLowerCase() ?? "",
    game_url: s.game_url ?? "",
    material_cost: s.material_cost ?? 0,
    category: s.category ?? "",
    program_fee: s.program_fee ?? [0, 0, 0, 0, 0],
    game_objective: s.objectiveData ?? "", // optional internal brief (AI context only)
    game_obj_1: objectivePoints?.[0] ?? "",
    game_obj_2: objectivePoints?.[1] ?? "",
    game_obj_3: objectivePoints?.[2] ?? "",
    game_outcome_1: outcomes?.[0] ?? "",
    game_outcome_2: outcomes?.[1] ?? "",
    game_outcome_3: outcomes?.[2] ?? "",
    game_tagline: welcomeSlide?.tagline?.trim() ?? "",
    game_welcome: welcomeSlide?.welcome?.trim() ?? "",
    model_name: welcomeSlide?.model_name?.trim() ?? "",
    model_type: welcomeSlide?.model_type ?? "wheel",
    model_reference: welcomeSlide?.model_reference ?? "",
    model_elements: (welcomeSlide?.elements ?? []).map((e) => ({ label: (e.label || "").trim(), line: (e.line || "").trim() })),
    game_welcome_image: groupedURLs["welcome_images"]?.[0] ?? "",
    welcome_scene: welcomeSlide?.scene ?? "",
    game_icon: groupedURLs["game_icons"]?.[0] ?? "",
    icon_concept: welcomeSlide?.icon_concept ?? "",
    key_title1: descriptionData?.title?.[0] ?? "",
    key_title2: descriptionData?.title?.[1] ?? "",
    key_title3: descriptionData?.title?.[2] ?? "",
    key_description1: descriptionData?.description?.[0] ?? "",
    key_description2: descriptionData?.description?.[1] ?? "",
    key_description3: descriptionData?.description?.[2] ?? "",
    game_type: s.game_type ?? "Inperson",
    format: isProgram ? "program" : "activity",
    program_modules: isProgram
      ? (programModules ?? []).filter((m) => (m.name || "").trim()).map((m) => ({ name: m.name.trim(), mins: parseInt(m.mins) || 0, how: (m.how || "").trim() }))
      : [],
    program_post: (s.programPost ?? "").trim(),
    isDeleted: false,
    created_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
    game_image: groupedURLs["games_activity"]?.[0] ?? "",
    game_image1: groupedURLs["games_activity"]?.[1] ?? "",
    game_image2: groupedURLs["games_activity"]?.[2] ?? "",
    // logo / special images are no longer collected in the form; existing values are kept on edit
    game_logo: groupedURLs["games_logo"]?.[0] ?? "",
    special_images: groupedURLs["games_special"] ?? [],
    game_cover: "", // cover slide retired (welcome slide replaces it)
    draft: !!draft,
  };
  if (s.editActivity != null) {
    await updateDoc(doc(db, CollectionName.games, s.editActivity), finalData);
  } else {
    await addDoc(collection(db, CollectionName.games), finalData);
  }
}
