import botpressAgent from './botpress-agent';

//Not using Jest or any other testing tool to keep it simple 
const tests = {
    loginTest: async ()=>{
        await botpressAgent.login('XXXXXXXXXX@XXXXXXX', 'XXXXXXXXXX');
        console.warn(botpressAgent.getAuth.basicAuthToken)
    },
    setGetBotIdTest: ()=> {
        botpressAgent.setBotId('convexa');
        console.log(botpressAgent.getBotId()==='convexa');
        botpressAgent.trainML();
    },
    createIntentTest: async ()=>{
        const res = await botpressAgent.createIntent('test-create2', ['create intent', 'please create intent', 'make new intent']);
        console.log(res);
    },
    createSlotTest: async ()=> {
        const res = await botpressAgent.createSlot('test-create2', 'test-slot');
        console.log(res);
    },
    attachSlotTest: async () => {
        const res = await botpressAgent.attachSlot('test-create2', 'please create intent','intent', 'test-slot');
        console.log(res);
    },
    tranMLTest: async ()=> {
        await botpressAgent.trainML();
    },
    getAllFlowTest: async () => {
       const res =  await botpressAgent.getAllFlows();
       console.log(res);
    },
    getAFlowTest: async () => {
        const res = await botpressAgent.getAFlow('main');
        console.log(res);
    },
    updateFlowTest: async ()=> {
        const flow = await botpressAgent.getAFlow('main');
        const startNodeName = flow.startNode;
        const startNodeIndex = flow.nodes.findIndex((node) => node.name === startNodeName);
        flow.nodes[startNodeIndex].next.push({
            "condition": `event.nlu.intent.name === 'test-create2'`,
            "node": "Slot-baf722"
        })
        const res = await botpressAgent.updateFlow('main', {flow});
    },
    createAPICallSkillTest: async ()=> {
        const res = await botpressAgent.createSkillAPI('main', 'http://google.com');
        console.log(res);
    },
    createSlotSkillTest: async () => {
        const res = await botpressAgent.createSkillSlot('main', 'test-create2', 'test-slot');
        console.log(res);
    }
}

async function execute() {
const keys = Object.keys(tests);
for(let i=0; i < keys.length; i++) {
    await tests[`${keys[i]}`].call(this, undefined);
};
}

//execute();
tests.setGetBotIdTest();
