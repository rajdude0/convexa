import { existsSync as exists, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import botpressAgent from './botpress-agent';

const BOT_INTENT_FOLDER = 'intents';
const BOT_FLOW_FOLDER = 'flows';

class Convexa {

    constructor(botId) {
      this.botId = botId;
      botpressAgent.setBotId(botId);
    }

    createNewIntent(intentName, utterances, slots, defaultIntentJson) {
        if (!intentName || !utterances) throw "Intent name or utterances array not defined";
        if(utterances.length < 2 ) console.warn("Less number of utterances may result in poor performance!!");
        let workingIntent = {
            "name": "apiget",
            "contexts": [
                "global"
            ],
            "utterances": {
                "en": [
                    `${intentName}`,
                ]
            },
            "slots": []
        }
        if (defaultIntentJson) {
            workingIntent = { ...defaultIntentJson };
        }

        workingIntent.name = intentName;
        workingIntent.utterances.en = utterances;
        writeFileSync(`${this.CWD}${path.sep}${BOT_INTENT_FOLDER}${path.sep}${intentName}.json`, JSON.stringify(workingIntent));
    }

    updateExistingFlow(flowName, intentName) {
        if (!flowName || !intentName) throw "Flowname or intentName not defined";
        if (!exists(`${this.CWD}${path.sep}${BOT_INTENT_FOLDER}${path.sep}${intentName}.json`)) throw `Intent ${intentName} doesn't exist`;
        const workingFlow = `${this.CWD}${path.sep}${BOT_FLOW_FOLDER}${path.sep}${flowName}.json`;
        if (!exists(workingFlow)) throw `Flow ${flowName} doesn't exist`;
        const flow = JSON.parse(readFileSync(workingFlow));
        const startNodeName = flow.startNode;
        const startNodeIndex = flow.nodes.findIndex((node) => node.name === startNodeName);
        flow.nodes[startNodeIndex].next.push({
            "condition": `event.nlu.intent.name === '${intentName}'`,
            "node": "Slot-baf722"
        })
        writeFileSync(workingFlow, JSON.stringify(flow));

    }

    async createAPIEntry({url, intentname, method, slots, utterances}) {
        await botpressAgent.login('rajsharm@akamai.com', 'Akamai_555');
        console.log("Login successfull");
        await botpressAgent.createIntent(intentname, utterances);
        console.log("Intent created");
        if(slots.length){

        for(let i=0; i < slots.length; i++) {
            const slotUrlTerm = slots[i].iname;
            const slotValue = slots[i].ivalue;
            if(!slotUrlTerm || !slotValue) continue;
            const slotId = `${slotValue}Slot`;
            await botpressAgent.createSlot(intentname, `${slotValue}Slot`);
            console.log("Slot created");
            for(let i=0; i < utterances.length; i++ )  await botpressAgent.attachSlot(intentname, utterances[i], slotValue, slotId);
            url = url.replace(slotUrlTerm, `{{session.slots.${slotId}.value}}`);

            const apiSkill = await botpressAgent.createSkillAPI('main', url, method);
            console.log("Api skill created");
            const slotSkill = await botpressAgent.createSkillSlot('main', intentname, slotId, apiSkill.name);
            console.log("Slot skill created");
            const flow = await botpressAgent.getAFlow('main');
            const startNodeName = flow.startNode;
            const startNodeIndex = flow.nodes.findIndex((node) => node.name === startNodeName);
            flow.nodes[startNodeIndex].next.push({
                "condition": `event.nlu.intent.name === '${intentname}'`,
                "node": slotSkill.name
            })
            const res = await botpressAgent.updateFlow('main', {flow});
            console.log("main flow updated");
            if(res.data) {
                console.log("API Entry created successfully !" );
                botpressAgent.trainML();
            }
            return;
         }
        }
       
        const apiSkill = await botpressAgent.createSkillAPI('main', url, method);
        console.log("Api skill created");
        const flow = await botpressAgent.getAFlow('main');
            const startNodeName = flow.startNode;
            const startNodeIndex = flow.nodes.findIndex((node) => node.name === startNodeName);
            flow.nodes[startNodeIndex].next.push({
                "condition": `event.nlu.intent.name === '${intentname}'`,
                "node": apiSkill.name
            })
            const res = await botpressAgent.updateFlow('main', {flow});
            console.log("main flow updated");
        if(res.data) {
            console.log("API Entry created successfully !" );
            botpressAgent.trainML();
        }
    }   
}

export default Convexa;


//const convexa = new Convexa('convexa');
//convexa.createAPIEntry({url:'http://google.com/<slot>', intentname: 'google-test', method: 'get', slot: 'Google', utterances: ['Hey Google', 'Hi Google', 'Wake up Google']});
