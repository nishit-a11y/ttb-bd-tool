const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const hbs = require("handlebars");
const moment = require("moment");

const fs = require("fs-extra");

const path = require("path");
require("./templates/helpers");

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);

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
    if (time === "Full Day") {
        return 3 - (participants < 30 ? 0 : 1);
    }
    if (time === "Half Day") {
        return 2 - (participants < 30 ? 0 : 1);
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
                if (data.virtual_info.day1.time === "Short") {
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

                  game.custom_notes=JSON.parse(data.custom_notes).filter(noteobj => noteobj.id==game.id)[0].note;
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

        //End - Praveen

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
         
        const page = await browser.newPage();

        let content;

        if (data.inperson == true){
            content = await compile("in-person/in-person", data);
        } else {
            content = await compile("virtual/virtual", data);
        }

        if (preview) {
            return content;
        }
        await page.setContent(content);

        await page.pdf({
            path: "Report.pdf",
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
    }
};

module.exports = { generate };