import axios from 'axios';
import generate from 'nanoid/generate'
import config from './configs';


const contentElementTextId = "builtin_text-XtHa2j"
const notFoundElementId = "builtin_text-LYXlHF"
const childNodeOnSuccessForForAPISkill = "node-f4e4";
const deadNode = "node-e31d";

const token = "Your TOKEN goes here"
const skills = {
    callAPI : 'CallAPI',
    slotFilling: 'Slot'
}
let activeBotId = 'convexa';

const botPresAPIs = {

    login: `${config.BOTPRESS}/api/v1/auth/login/basic/default`,
  /* POST
    Authorization: Bearer <Token>
    Content - Type: application / json;charset = UTF - 8
    */
    creatIntent: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/intents`,
  /*GET
    Authorization: Bearer <Token>
    Content - Type: application / json;charset = UTF - 8
     */
    getAllIntents: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/intents`,
    getIntent: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/intents/<intent-name>`,
    deleteIntent: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/intents/<intent-name>/delete`,

  /*POST
    Authorization: Bearer <Token>
    Content - Type: application / json;charset = UTF - 8
    Request Body: {"name":"test","filename":"test.json","contexts":["global"],"utterances":{"en":["test","Something"]},"slots":[]}
    //filename is the name of the intent that you are modifying with .json appened, this request body is only to create intent without any slots
    to create slots provide following body
    {"name":"test","filename":"test.json","contexts":["global"],"utterances":{"en":["test","Something"]},"slots":[{"id":"HAESb6Kq7kRYJ2ss7ZICM","name":"x","entities":["any"],"color":1}]}
    generate the ID using https://www.npmjs.com/package/nanoid-generate 
     export const prettyId = (length = 10) => generate('1234567890abcdef', length)

     To Apply slots in the utterances using request body as follows
     {"name":"test","filename":"test.json","contexts":["global"],"utterances":{"en":["test","[Something x](i)"]},"slots":[{"id":"HAESb6Kq7kRYJ2ss7ZICM","name":"x","entities":["any"],"color":1},{"id":"TMelaFP6PcHu1Q-xx0feA","name":"i","entities":["any"],"color":2}]}
     Basically, [<utterance>](slot-name)
     */

    updateIntent: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/intents`,


    /*GET
      Authorization: Bearer <Token>
     */
    forceTrainML: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/mod/nlu/ml-recommendations`,

  /*GET
     Authorization: Bearer <Token>
     Respose Body: Array of all flows
    */
    getAllFlows: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/flows`,

    /*
    GET
    Authorization: Bearer <Token>
    Request Body:  {"ids":["convexa_table-vfMp6u","builtin_text-01583Y","builtin_card-W4U8k4","convexa_table-oAT2E-"]}

    */
    getAllElements: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/content/elements`,

    /*
    POST
    Authorization: Bearer <Token>
    Request Body: Modified flow object
    <flow-name> is the name of flow with .json appened. Eg; main.flow.json
    */
    updateFlow: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/flow/<flow-name>`,

    ping : `${config.BOTPRESS}/api/v1/auth/ping`,

    /*IMPORTANT: steps to create a CALL API Skill 
     1. Call the generateCallAPIFlow, it will give your flow object with nodes in it and also a transition object.
     2. Push a new node in the main.flow.json using this transition object in the next of this new node, make sure the name and id and filepath includes object in following order
      {
        flow: "skills/CallAPI-7680d1.flow.json"
        id: "skill-7680d1"
        name: "CallAPI-7680d1"
        next: [{caption: "On success", condition: "temp.valid", node: ""},…] //transition object
        onEnter: null
        onReceive: null
        skill: "CallAPI"
        type: "skill-call"
        x: 30.521354157390974
        y: 784.7110912646252
    }
    3. call createflow to create skill flow 
    
    */
    /* POST
      Request Body: {"method":"get","memory":"temp","headers":{"Authorization":"{{session.token}}","Content-type":"application/json"},"url":"http://something.com","variable":"response","invalidJson":false}
      Response Body: Flow Object
      {"flow":{"nodes":[{"name":"entry","onEnter":["basic-skills/call_api {\"url\":\"http://something.com\",\"method\":\"get\",\"headers\":{\"Authorization\":\"{{session.token}}\",\"Content-type\":\"application/json\"},\"memory\":\"temp\",\"variable\":\"response\"}"],"next":[{"condition":"true","node":"#"}],"id":"548655"}],"catchAll":{"next":[]},"version":"0.0","name":"360588","location":"360588","startNode":"entry"},"transitions":[{"caption":"On success","condition":"temp.valid","node":""},{"caption":"On failure","condition":"!temp.valid","node":""}]}
     */
    generateSkillFlow: `${config.BOTPRESS}/api/v1/modules/basic-skills/skill/<skill-name>/generateFlow?botId=${activeBotId}`,
    /*POST
      Request Body: {"flow":{"name":"skills/CallAPI-7680d1.flow.json","version":"0.0.1","flow":"skills/CallAPI-7680d1.flow.json","location":"skills/CallAPI-7680d1.flow.json","startNode":"entry","catchAll":{"next":[]},"nodes":[{"name":"entry","onEnter":["basic-skills/call_api {\"url\":\"dfdfdfdfd\",\"method\":\"get\",\"memory\":\"temp\",\"variable\":\"response\"}"],"next":[{"condition":"true","node":"#"}],"id":"194744"}],"skillData":{"method":"get","memory":"temp","url":"dfdfdfdfd","variable":"response","invalidJson":false}}}
     */
    createFlow: `${config.BOTPRESS}/api/v1/bots/${activeBotId}/flow`,




}

const prettyId = (length = 10) => generate('1234567890abcdef', length)

const createSlot = (slotname) => {
    return {
        color: Math.floor((Math.random() * 100) + 1),
        entities: ['any'],
        id: prettyId(),
        name:slotname,
    }
}

const createAPISkill = (url, method) => {
    return {"method":method|| "get","memory":"session","headers":{"Authorization":`Bearer {{session.token}}`,"Content-type":"application/json"},"url":`${url}`,"variable":"response","invalidJson":false}
}

const createSlotSkill = (intent, slotname) => {
    return {"retryAttempts":3,"contentElement":`${contentElementTextId}`,"notFoundElement":`${notFoundElementId}`,"turnExpiry":-1,"intent":intent,"slotName":slotname,"entities":["any"]}
}

const generateSkillNodeObject = (type, ) => {
            const randid = generate('abcdef1234567890', 6);
            return {
                flow: `skills/${type}-${randid}.flow.json`,
                id: `skill-${randid}`,
                name: `${type}-${randid}`,
                next: [], //transition object
                onEnter: null,
                onReceive: null,
                skill: type,
                type: "skill-call",
                x: Math.random()*100,
                y: Math.random()*100,
            }
}

const createAPICallFlow = (location, nodeObject, skillData) => {
    return {"flow":{"name":`${location}`,"version":"0.0.1","flow":`${location}`,"location":`${location}`,"startNode":"entry","catchAll":{"next":[]},"nodes":nodeObject,"skillData":skillData}}
}

const createSlotFlow = (location, nodeObject, skillData) => {
    return {"flow":{"name":`${location}`,"version":"0.0.1","flow":`${location}`,"location":`${location}`,"startNode":"check-if-extracted","catchAll":{"next":[]},"nodes":nodeObject,"skillData":skillData}}
}

const auth = {
    isLoggedIn: false,
    basicAuthToken: ''
}
const setToken = (token) => {
        auth.isLoggedIn = true;
        auth.basicAuthToken = `Bearer ${token}`;
        axios.interceptors.request.use((config) => {
            config.headers[`Authorization`] =  auth.basicAuthToken;
            return config;
        });
}

const continousPing = ()=> {
    if(auth.isLoggedIn) {
        setInterval(()=>{
            console.log(`Pinging >>>> ${config.BOTPRESS}`)
            axios.get(botPresAPIs.ping);
        }, 10*1000)
    }
}

const headers = {
    "Content-Type": "application/json"
}

export { createSlot, prettyId };

export default {
    setBotId: (botId)=> {
        activeBotId = botId
    },
    getBotId: ()=> activeBotId,

    getAuth : auth,

    login: async (email, password) => {
            const {data} = await axios.post(botPresAPIs.login, {email, password}, {
                headers: headers
            });
            if(data && data.status==='success' && data.payload) {
            setToken(data.payload.token);
            continousPing();       
            }
    },
    
    createIntent: async (intentName, utterances) => {
        //intentJson should not have the slots {"name":"test","utterances":{"en":["test"]}}
        //create
        console.log(intentName);
         await axios.post(botPresAPIs.creatIntent, {name: intentName, "utterances": { en: utterances}}, {
             headers: headers
         });
         const intentObj = {
             name: intentName,
             filename: intentName + ".json",
             contexts: ["global"],
             "utterances": {en: utterances},
             slots: []
         }
         console.log(intentObj);
         const res = await axios.post(botPresAPIs.updateIntent, intentObj, { headers: headers});
         if(!res.data) throw 'Error while creating intent';
         return intentObj;
    },

    createSlot: async (intentName, slotName) => {
        console.log(botPresAPIs.getIntent.replace("<intent-name>", intentName))
        const {data} = await axios.get(botPresAPIs.getIntent.replace("<intent-name>", intentName));
        const newSlot = createSlot(slotName);
        if(data && data.slots) {
        const {slots} = data;
            slots.push(newSlot);
        }
        const res = await axios.post(botPresAPIs.updateIntent, {...data});
       if(!res.data) throw 'Error while creating a slot';
       return newSlot;
       
    },

    attachSlot: async (intentName, utterance, slotWord, slotname) => {
        const {data} = await axios.get(botPresAPIs.getIntent.replace("<intent-name>", intentName));
        if(data && data.utterances) {
            const {utterances:en} = data;
            const utteranceSections = utterance.split(slotWord);
            console.log(utteranceSections);
            const slottedUtterance = `[${slotWord}](${slotname})`;
            const finalUtterance = utteranceSections.reduce((prev, curr, i)=> {
                if(i === utteranceSections.length - 1) return prev.concat(curr);
                return prev.concat(curr.concat(slottedUtterance))
            }, '');
            console.log(finalUtterance);
            const utteranceDup = en.en.filter(item=> item!==utterance);
            utteranceDup.push(finalUtterance);
            data.utterances.en = utteranceDup;
            const res = await axios.post(botPresAPIs.updateIntent, {...data});
            if(!res.data) throw 'Error while attaching slot';
        }
       
    },

    trainML: ()=> {
        console.log(botPresAPIs.forceTrainML);
        axios.get(botPresAPIs.forceTrainML);
    },
    getAllFlows: async ()=>{
        const {data} = await axios.get(botPresAPIs.getAllFlows);
        return data;
    },
    getAFlow: async function(flowname) {
        const {data} = await axios.get(botPresAPIs.getAllFlows);
        if(data && data instanceof Array) {
            return data.find(item=> item.name === `${flowname}.flow.json`);
        }
    },
    updateFlow: async function(flowname, flowJson) {
        console.log(JSON.stringify(flowJson, null , 2));
        const { data } = await axios.post(botPresAPIs.updateFlow.replace('<flow-name>', `${flowname}.flow.json`), flowJson, {
            headers: headers
        });
        return data;
    },
    createSkillAPI: async function (flowname, url, method, childNodeOnSuccess ) {
        const apiSkillData = createAPISkill(url, method);
        const { data } = await axios.post(botPresAPIs.generateSkillFlow.replace('<skill-name>', skills.callAPI), apiSkillData, {
            headers: headers
        });
        if(!data) throw 'Error while generating flow';
        const {flow: nodes } = data;
        const skillNodeObject = generateSkillNodeObject(skills.callAPI);
        data.transitions[0].node = childNodeOnSuccess || childNodeOnSuccessForForAPISkill;
        data.transitions[1].node = deadNode

        skillNodeObject.next = data.transitions;
        const mainFlow = await this.getAFlow(flowname);
        mainFlow.nodes.push(skillNodeObject);
        console.log(JSON.stringify(mainFlow, null ,2));
        const mainFlowResp = await axios.post(botPresAPIs.updateFlow.replace('<flow-name>', `${flowname}.flow.json`), {flow: mainFlow},{
            headers: headers
        });
        if(!mainFlowResp.data) throw `${flowname} updating failed`;
        const flowObject = createAPICallFlow(skillNodeObject.flow, data.flow.nodes, apiSkillData);
        console.log(JSON.stringify(flowObject, null , 2));
        const res = await axios.post(botPresAPIs.createFlow, flowObject, {
            headers: headers
        });
        if(res.data){
            return {...skillNodeObject};
        }
    },

    createSkillSlot: async function(flowname, intentname, slotname, childNodeOnSuccess) {
        const slotData = createSlotSkill(intentname, slotname);
        const { data } = await axios.post(botPresAPIs.generateSkillFlow.replace('<skill-name>', skills.slotFilling), slotData, {
            headers: headers
        }); 
        console.log(">>>>>", data);
        if(!data) throw 'Error while generating flow';
        const skillNodeObject = generateSkillNodeObject(skills.slotFilling);
        data.transitions[0].node = childNodeOnSuccess || deadNode;
        data.transitions[1].node = deadNode;
        data.transitions[2].node = childNodeOnSuccess || deadNode
        skillNodeObject.next = data.transitions;
        const mainFlow = await this.getAFlow(flowname);
        mainFlow.nodes.push(skillNodeObject);
        console.log(mainFlow);
        const mainFlowResp = await axios.post(botPresAPIs.updateFlow.replace('<flow-name>', `${flowname}.flow.json`), {flow: mainFlow}, {
            headers: headers
        });
        if(!mainFlowResp.data) throw `${flowname} updating failed`;
        const flowObject = createSlotFlow(skillNodeObject.flow, data.flow.nodes, slotData);
        const res = await axios.post(botPresAPIs.createFlow, flowObject, {
            headers: headers
        })
        if(res.data) {
            return {...skillNodeObject};
        }
    }
}
