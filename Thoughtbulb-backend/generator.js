const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer-core");
const hbs = require("handlebars");
const moment = require("moment");

const fs = require("fs-extra");

const path = require("path");
require("./templates/helpers");

const compile = async function (templateName, data) {
    const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);

    const html = await fs.readFile(filePath, "utf8");
    return hbs.compile(html)(data);
};

const formatDate = function (display_month_only, dateString) {
    let date_format = "MMMM YYYY";
    let date = moment(new Date(dateString));
    if (display_month_only) {
        return date.format(date_format);
    }
    let dayOfMonth = date.date();
    let dateOrdinal = dayOfMonth + "<sup>" + getOrdinal(dayOfMonth) + "</sup> ";
    let completeDate = dateOrdinal + date.format(date_format);
    return completeDate;
};

function getOrdinal(n) {
    if (!n) return "";
    if (n >= 11 && n <= 13) {
        return "th";
    }
    switch (n % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function checkActivitiesForInPerson(participants, time) {
    // up to 30 participants (inclusive) fit one more activity - matches the program flow rule
    if (time === "Full Day") {
        return 3 - (participants <= 30 ? 0 : 1);
    }
    if (time === "Half Day") {
        return 2 - (participants <= 30 ? 0 : 1);
    }
    if (time === "Short") {
        return 1;
    }
}

function checkActivitiesForVirtual(time) {
    if (time === "Short") {
        return 1;
    }
    if (time === "Extended") {
        return 2;
    }
}

const generate = async function (data, objs, games, preview) {
    console.log(data)
    try {
        const obj_map = {
            Fun: "fun",
            Collaboration: "collaboration",
            Communication: "communication",
            Networking: "networking",
            "Problem Solving Skills": "problem_solving",
            "Innovation and creativity": "innovation",
            "Spark Energy": "spark_energy",
            "Big Picture Thinking": "big_picture",
            "Analytical Skills": "analytical_skills",
            "Ownership and Accountability": "ownership",
        };

        let date_format = "Do MMMM YYYY";
        if (data.display_month_only) {
            date_format = "MMMM YYYY";
        }
        let is_fulfilled = false;
        let is_actiity_only_one = false;
        let day2_activity_array = [];

        if (data.inperson) {
            if (data.inperson_info.days === 1) {
                data.in_days_1 = true;
                data.inperson_info.day1.date = formatDate(
                    data.display_month_only,
                    data.inperson_info.day1.date
                );
            } else if (data.inperson_info.days === 2) {
                data.in_days_2 = true;
                data.inperson_info.day1.date = formatDate(
                    data.display_month_only,
                    data.inperson_info.day1.date
                );
                data.inperson_info.day2.date = formatDate(
                    data.display_month_only,
                    data.inperson_info.day2.date
                );
            }
        } else if (data.virtual) {
            if (data.virtual_info.days === 1) {
                data.vi_days_1 = true;
                data.virtual_info.day1.date = formatDate(
                    data.display_month_only,
                    data.virtual_info.day1.date
                );
            } else if (data.virtual_info.days === 2) {
                data.vi_days_2 = true;
                data.virtual_info.day1.date = formatDate(
                    data.display_month_only,
                    data.virtual_info.day1.date
                );
                data.virtual_info.day2.date = formatDate(
                    data.display_month_only,
                    data.virtual_info.day2.date
                );
            }
        }

        let no_of_activities = data.pricing.material_cost_fees.length;
        if (data.inperson) {
            var inperson_act_count = 0;

            if (data.inperson_info.day1.participants <= 30) {
                if (data.inperson_info.day1.time === "Full Day") {
                    data.proposal_flow1 = false;
                    data.proposal_flow2 = false;
                    data.proposal_flow3 = true;
                    inperson_act_count = inperson_act_count + 3;
                }
                if (data.inperson_info.day1.time === "Half Day") {
                    data.proposal_flow1 = false;
                    data.proposal_flow2 = true;
                    data.proposal_flow3 = false;
                    inperson_act_count = inperson_act_count + 2;
                }
                if (data.inperson_info.day1.time === "Short") {
                    data.proposal_flow1 = true;
                    data.proposal_flow2 = false;
                    data.proposal_flow3 = false;
                    inperson_act_count = inperson_act_count + 1;
                }
            }

            if (data.inperson_info.day1.participants > 30) {
                if (data.inperson_info.day1.time === "Full Day") {
                    data.proposal_flow1 = false;
                    data.proposal_flow2 = true;
                    data.proposal_flow3 = false;
                    inperson_act_count = inperson_act_count + 2;
                }
                if (data.inperson_info.day1.time === "Half Day") {
                    data.proposal_flow1 = true;
                    data.proposal_flow2 = false;
                    data.proposal_flow3 = false;
                    inperson_act_count = inperson_act_count + 1;
                }
                if (data.inperson_info.day1.time === "Short") {
                    data.proposal_flow1 = true;
                    data.proposal_flow2 = false;
                    data.proposal_flow3 = false;
                    inperson_act_count = inperson_act_count + 1;
                }
            }

            if (data.inperson_info.days === 2) {
                if (data.inperson_info.day2.participants <= 30) {
                    if (data.inperson_info.day2.time === "Full Day") {
                        data.proposal1_flow1 = false;
                        data.proposal1_flow2 = false;
                        data.proposal1_flow3 = true;
                        inperson_act_count = inperson_act_count + 3;
                    }
                    if (data.inperson_info.day2.time === "Half Day") {
                        data.proposal1_flow1 = false;
                        data.proposal1_flow2 = true;
                        data.proposal1_flow3 = false;
                        inperson_act_count = inperson_act_count + 2;
                    }
                    if (data.inperson_info.day2.time === "Short") {
                        data.proposal1_flow1 = true;
                        data.proposal1_flow2 = false;
                        data.proposal1_flow3 = false;
                        inperson_act_count = inperson_act_count + 1;
                    }
                }

                if (data.inperson_info.day2.participants > 30) {
                    if (data.inperson_info.day2.time === "Full Day") {
                        data.proposal1_flow1 = false;
                        data.proposal1_flow2 = true;
                        data.proposal1_flow3 = false;
                        inperson_act_count = inperson_act_count + 2;
                    }
                    if (data.inperson_info.day2.time === "Half Day") {
                        data.proposal1_flow1 = true;
                        data.proposal1_flow2 = false;
                        data.proposal1_flow3 = false;
                        inperson_act_count = inperson_act_count + 1;
                    }
                    if (data.inperson_info.day2.time === "Short") {
                        data.proposal1_flow1 = true;
                        data.proposal1_flow2 = false;
                        data.proposal1_flow3 = false;
                        inperson_act_count = inperson_act_count + 1;
                    }
                }
            }
            data.inperson_act_count = inperson_act_count;
        }

        if (data.virtual) {
            var virtual_act_count = 0;
            if (data.virtual_info.day1.time === "Extended") {
                data.proposal_flow1 = false;
                data.proposal_flow2 = true;
                data.proposal_flow3 = false;
                virtual_act_count = virtual_act_count + 2;
            }
            if (data.virtual_info.day1.time === "Short") {
                data.proposal_flow1 = true;
                data.proposal_flow2 = false;
                data.proposal_flow3 = false;
                virtual_act_count = virtual_act_count + 1;
            }

            if (data.virtual_info.days === 2) {
                if (data.virtual_info.day2.time === "Extended") {
                    data.proposal1_flow1 = false;
                    data.proposal1_flow2 = true;
                    data.proposal1_flow3 = false;
                    virtual_act_count = virtual_act_count + 2;
                }
                if (data.virtual_info.day2.time === "Short") {
                    data.proposal1_flow1 = true;
                    data.proposal1_flow2 = false;
                    data.proposal1_flow3 = false;
                    virtual_act_count = virtual_act_count + 1;
                }
            }
        }
        if (data.inperson) {
            let tot = checkActivitiesForInPerson(
                data.inperson_info.day1.participants,
                data.inperson_info.day1.time
            );
            if (data.inperson_info.days == 2)
                tot += checkActivitiesForInPerson(
                    data.inperson_info.day2.participants,
                    data.inperson_info.day2.time
                );

            no_of_activities == tot ? (is_fulfilled = true) : (is_fulfilled = false);
        }
        if (data.virtual) {
            let tot = checkActivitiesForVirtual(data.virtual_info.day1.time);
            if (data.virtual_info.days == 2)
                tot += checkActivitiesForVirtual(data.virtual_info.day2.time);

            no_of_activities == tot ? (is_fulfilled = true) : (is_fulfilled = false);
        }
        if (data.on_actuals) {
            data.pricing.facilitation_fee.travel_stay_meals = 0;
        }
        let total_price = 0;
        if (is_fulfilled) {
            if (data.inperson)
                total_price +=
                    (parseInt(data.pricing.facilitation_fee.travel_stay_meals) || 0) +
                    (parseInt(data.pricing.facilitation_fee.facilitation) || 0) +
                    (parseInt(data.pricing.facilitation_fee.addons.fee) || 0);
            for (let i = 0; i < no_of_activities; i++)
                total_price += parseInt(data.pricing.material_cost_fees[i]) || 0;
            total_price =
                "INR " +
                total_price
                    .toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                    })
                    .slice(1, -3);
        }
        data.total_price = total_price;
        data.is_fulfilled = is_fulfilled;

        data.display_template_target_3_1 = no_of_activities > 2 ? false : true;

        const selected_games = [];

        data.game.forEach((selected, index) => {
            games.forEach((game) => {
                if (game.id === selected) {
                    game.index = index + 1;
                    // console.log("custom notes")
                    //  if (data.custom_notes)
                    // console.log("custom notes"+ JSON.parse(data.custom_notes).length)

                  // Older proposals have no custom_notes (or miss an activity) - treat as "no custom slide" instead of crashing
                  let notesArr = [];
                  try { notesArr = data.custom_notes ? JSON.parse(data.custom_notes) : []; } catch (e) { notesArr = []; }
                  const noteObj = (Array.isArray(notesArr) ? notesArr : []).filter(noteobj => noteobj && noteobj.id == game.id)[0] || {};
                  game.custom_notes = noteObj.note || "";
                  game.custom_image = noteObj.image || "";

                  // Activity background gradients — one per activity, cycles if >5 activities
                  // ROLLBACK: remove these lines and replace {{bg_gradient}} in hbs with BG5.jpg url
                  // Near-white tints: visible identity per activity without competing with
                  // the orange text, blue/green/orange info boxes, or photo content.
                  const activityGradients = [
                    "linear-gradient(150deg, #FFF2F2 0%, #FFF7F4 100%)",  // 1 — blush
                    "linear-gradient(150deg, #F5F2FF 0%, #F8F4FF 100%)",  // 2 — lavender mist
                    "linear-gradient(150deg, #FFFBF0 0%, #FFFDF6 100%)",  // 3 — warm cream
                    "linear-gradient(150deg, #F0FFF6 0%, #F4FFFA 100%)",  // 4 — mint whisper
                    "linear-gradient(150deg, #F0F7FF 0%, #F4F9FF 100%)",  // 5 — ice blue
                  ];
                  // Saturated strip colors — same hue family as the gradient above
                  const activityStripColors = [
                    "#D95F6A",  // 1 — coral rose  (blush family)
                    "#7B6FD8",  // 2 — medium purple (lavender family)
                    "#C48A20",  // 3 — warm amber   (cream family)
                    "#2E9E60",  // 4 — medium green  (mint family)
                    "#3A7EC9",  // 5 — medium blue   (ice blue family)
                  ];
                  game.bg_gradient  = activityGradients[index % activityGradients.length];
                  game.strip_color  = activityStripColors[index % activityStripColors.length];

                    selected_games.push(game);

                }
            });
        });

        data.selected_games = selected_games;
        if (selected_games.length > 5) {
            data.more_activities = true;
        }
        if (selected_games.length == 1 && is_fulfilled) is_actiity_only_one = true;

        data.is_actiity_only_one = is_actiity_only_one;

        if (data.default_objective) {
            data.def_obj_1 = objs[obj_map[data.default_objective_info[0]]];
            data.def_obj_2 = objs[obj_map[data.default_objective_info[1]]];
            data.def_obj_3 = objs[obj_map[data.default_objective_info[2]]];
            data.def_obj_4 = objs[obj_map[data.default_objective_info[3]]];
        }

        /**Start -Praveen
         * Intention is to prepare a separate array for Day 2 activities which can be directly
         * accessed by indexing in the html
         */
        if (data.inperson) {
            let day1_activities_count = checkActivitiesForInPerson(
                data.inperson_info.day1.participants,
                data.inperson_info.day1.time
            );
            for (let i = day1_activities_count; i < selected_games.length; i++)
                day2_activity_array.push(selected_games[i]);
        }
        if (data.virtual) {
            let day1_activities_count = checkActivitiesForVirtual(data.virtual_info.day1.time);
            for (let i = day1_activities_count; i < selected_games.length; i++)
                day2_activity_array.push(selected_games[i]);
        }
        data.day2_activity_array = day2_activity_array;

        // ---- New pricing page view-model (in-person). Modes:
        // fixed_single (A + B), fixed_multi (A + B = total), pick1 (one complete card per option), choice (A + B menu + formula)
        try {
            const isVirtual = !data.inperson && data.virtual;
            const info0 = isVirtual ? data.virtual_info : data.inperson_info;
            const feeCount = ((data.pricing && data.pricing.material_cost_fees) || []).length;
            // if saved prices don't line up with the selected activities, keep the old table (shows exactly what was saved)
            if (data.pricing && info0 && info0.day1 && feeCount === selected_games.length) {
                const inr = (n) => "₹" + Math.round(Math.abs(n)).toLocaleString("en-IN");
                const ACC = ["#D95F6A", "#7B6FD8", "#C48A20", "#2E9E60", "#3A7EC9"];
                const TINT = ["#FFF2F2", "#F5F2FF", "#FFFBF0", "#EEFBF3", "#EEF5FF"];
                const info = info0, days = info.days == 2 ? 2 : 1;
                const cap = (d) => isVirtual ? (checkActivitiesForVirtual(d.time) || 0) : (checkActivitiesForInPerson(d.participants, d.time) || 0);
                const f = data.pricing.facilitation_fee || {};
                // Virtual: only the program fee per activity is shown and totalled (no facilitation / travel / add-ons)
                const fac = isVirtual ? 0 : (parseInt(f.facilitation) || 0);
                const travelAmt = isVirtual || data.on_actuals ? 0 : (parseInt(f.travel_stay_meals) || 0);
                const addonFee = isVirtual ? 0 : (parseInt(f.addons && f.addons.fee) || 0);
                const addonDesc = (f.addons && f.addons.description) || "";
                const isDiscount = addonDesc === "Discount" || addonFee < 0;
                const fees = data.pricing.material_cost_fees || [];
                const d1 = cap(info.day1);
                const d2 = days == 2 ? cap(info.day2) : 0;
                const pax = Math.max(parseInt(info.day1.participants) || 0, days == 2 ? (parseInt(info.day2.participants) || 0) : 0);
                const addonSigned = isDiscount ? -Math.abs(addonFee) : addonFee; // a "Discount" always reduces the price
                const partA = fac + travelAmt + addonSigned;
                const items = selected_games.map((g, i) => {
                    const fee = parseInt(fees[i]) || 0;
                    const total = partA + fee;
                    return { name: (g.data.game_name || "").trim(), icon: g.data.game_icon || g.data.game_logo || "", fee: fee ? inr(fee) : "Included", fee_raw: fee, day: i < d1 ? 1 : 2,
                        accent: ACC[i % 5], tint: TINT[i % 5], show_day: true, option: i + 1, total: inr(total), per_person: pax ? inr(total / pax) : "" };
                });
                const partB = selected_games.reduce((s, g, i) => s + (parseInt(fees[i]) || 0), 0);
                const pick = d1 + d2;
                if (!(items.length === pick)) items.forEach((it) => { it.show_day = false; }); // day split only known when every slot is filled
                let mode;
                // fewer activities than slots = nothing to choose, so treat as fixed; pick-1 cards only fit up to 5 options
                const fixed = is_fulfilled || items.length <= pick;
                if (fixed) mode = days == 2 ? "fixed_multi" : "fixed_single";
                else mode = days == 1 && pick == 1 && items.length <= 5 ? "pick1" : "choice";
                const timeLabel = (t) => (t === "Full Day" ? "Full day" : t === "Half Day" ? "Half day" : t === "Short" ? "Short session" : t === "Extended" ? "Extended session" : t || "");
                const place = !isVirtual && info.location && info.location !== "TBD" ? info.location : "";
                const subBits = days == 2 ? [`Day 1: ${timeLabel(info.day1.time)}`, `Day 2: ${timeLabel(info.day2.time)}`] : [timeLabel(info.day1.time)];
                if (place) subBits.push(place);
                if (pax) subBits.push(`${pax} participants`);
                if (mode === "pick1") subBits.push("choose any 1");
                data.pv = {
                    [mode]: true, mode, days, multi: days == 2, virtual: isVirtual, has_fac: fac > 0, show_a: !isVirtual,
                    b_title: isVirtual ? "Program Fee" : "Consumable Material Cost", b_unit: isVirtual ? "program fee" : "materials",
                    subtitle: subBits.filter(Boolean).join(" · "),
                    fac: fac ? inr(fac) : "Nil", part_a_plain: partA,
                    travel_actuals: !isVirtual && !!data.on_actuals, travel: travelAmt ? inr(travelAmt) : "", travel_nil: !data.on_actuals && !travelAmt,
                    addon: addonFee && !isDiscount ? { desc: addonDesc, fee: inr(addonFee) } : null,
                    discount: addonFee && isDiscount ? { fee: inr(addonFee) } : null,
                    part_a: inr(partA), part_b: inr(partB), total: inr(partA + partB),
                    per_person: pax ? inr((partA + partB) / pax) : "", pax,
                    items, pick, n_items: items.length, compact: items.length > 4,
                    card_width: items.length >= 5 ? 196 : items.length == 4 ? 236 : 300,
                };
            }
        } catch (e) { console.log("pricing view error", e); data.pv = null; }

        // ---- New program-flow view-model (one page; replaces the divider + per-day flow pages)
        try {
            const isV = !data.inperson && data.virtual;
            const info = isV ? data.virtual_info : data.inperson_info;
            if (info && info.day1 && !data.remove_program_flow) {
                const ACC = ["#D95F6A", "#7B6FD8", "#C48A20", "#2E9E60", "#3A7EC9"];
                const TINT = ["#FFF2F2", "#F5F2FF", "#FFFBF0", "#EEFBF3", "#EEF5FF"];
                const days = info.days == 2 ? 2 : 1;
                const cap = (d) => isV ? (checkActivitiesForVirtual(d.time) || 0) : (checkActivitiesForInPerson(d.participants, d.time) || 0);
                const caps = [cap(info.day1), days == 2 ? cap(info.day2) : 0];
                const slots = caps[0] + caps[1];
                const timeLabel = (t) => (t === "Full Day" ? "Full day" : t === "Half Day" ? "Half day" : t === "Short" ? "Short session" : t === "Extended" ? "Extended session" : t || "");
                const actTime = (t) => (t === "Short" ? "" : "90–120 MINS");
                const items = selected_games.map((g, i) => ({
                    name: (g.data.game_name || "").trim(), icon: g.data.game_icon || g.data.game_logo || "",
                    tagline: g.data.game_tagline || "", welcome: g.data.game_welcome || "",
                    outcomes: [g.data.game_outcome_1, g.data.game_outcome_2].filter(Boolean),
                    accent: ACC[i % 5], tint: TINT[i % 5],
                }));
                const fixed = items.length <= slots;
                const E = { energiser: true }, D = { debrief: true }, B = { brk: true };
                const withBreaks = (list) => list.reduce((acc, n, i) => (i ? acc.concat([B, n]) : [n]), []);
                const clean = (x) => String(x || "").replace(/<[^>]+>/g, "");
                const dayInfo = [info.day1, info.day2].map((x) => x && ({ ...x, date: clean(x.date) }));
                let cursor = 0, slotNo = 0;
                const dayRows = [];
                for (let d = 0; d < days; d++) {
                    const di = dayInfo[d]; let mid = [];
                    if (fixed) {
                        const take = d == days - 1 ? items.length - cursor : Math.min(caps[d], items.length - cursor);
                        mid = items.slice(cursor, cursor + take).map((it) => ({ act: true, ...it, time: actTime(di.time) }));
                        cursor += take;
                    } else if (slots == 1) {
                        mid = [{ chosen: true, time: actTime(di.time) }];
                    } else {
                        for (let k = 0; k < caps[d]; k++) { slotNo++; mid.push({ slot: true, n: slotNo, accent: ACC[(slotNo - 1) % 5], time: actTime(di.time) }); }
                    }
                    dayRows.push({ label: `DAY ${d + 1}`, sub: [di.date, timeLabel(di.time)].filter(Boolean).join(" · "), nodes: [E, ...withBreaks(mid), D], count: mid.length });
                }
                const place = !isV && info.location && info.location !== "TBD" ? info.location : "";
                const pax = Math.max(parseInt(info.day1.participants) || 0, days == 2 ? (parseInt(info.day2.participants) || 0) : 0);
                const subtitle = (days == 1 ? [timeLabel(info.day1.time), dayInfo[0].date, place] : [place]).concat(pax ? [`${pax} participants`] : []).filter(Boolean).join(" · ");
                const icebreakers = isV ? ["Wave", "Find it", "Move Your Body", "Switch On/Off", "My Favourite", "Stretches"]
                    : ["Similarities", "Wow Orchestra", "Creative Handshakes", "Mexican Wave", "Clap-Clap-Go", "04 Corners", "My Preferences"];
                data.fv = {
                    multi: days == 2, single: days == 1, virtual: isV, subtitle,
                    title: days == 2 ? "Your 2-day program flow" : "Program flow",
                    row: dayRows[0], rows: dayRows, fixed, choice: !fixed, pick: slots,
                    options: items, two_col: items.length > 3, n_items: items.length,
                    one_item: fixed && items.length == 1, item: items[0],
                    many_items: fixed && items.length > 1,
                    icebreakers, wide_track: dayRows[0].nodes.length <= 3,
                };
            }
        } catch (e) { console.log("flow view error", e); data.fv = null; }

        //End - Praveen

        let content;

        if (data.inperson == true){
            content = await compile("in-person/in-person", data);
        } else {
            content = await compile("virtual/virtual", data);
        }

        if (preview) {
            return content;
        }

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(
                "https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-pack.tar"
            ),
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(content, { waitUntil: "networkidle0" });

        await page.pdf({
            path: "/tmp/Report.pdf",
            landscape: true,
            printBackground: true,
            width: "608",
            height: "1080",
        });

        console.log("done creating pdf");

        console.log(data)

        await browser.close();

        return true;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = { generate };