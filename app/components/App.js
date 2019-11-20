import React from 'react';
import ReactDom from 'react-dom';
import configs from '../../configs';
import '../style.css';
import { JsonToTable } from 'react-json-to-table';

const myJSON = [
    {
        "streamId": 3364,
        "streamName": "StreamCreation",
        "streamVersionId": 1,
        "streamTypeId": 1,
        "createdBy": "tblackfo",
        "createdDate": "15-11-2019 05:49:05 UTC",
        "sampleRate": 100,
        "timeFrame": null,
        "currentVersionId": 1,
        "archived": "N",
        "activationStatus": "ACTIVATED",
        "tapiocaStatus": "DONE",
        "scStatus": "DONE",
        "failedConnectors": [],
        "groupId": 92728,
        "groupName": "Performance Analytics-M-1YDFEU9",
        "contractId": "M-1YDFEU9",
        "arlInfos": [
            {
                "arlId": 436022,
                "propertyName": "datastream-sqa-test-property",
                "status": "DONE",
                "accountId": "B-M-1YDG7I3",
                "contractId": "M-1YDFEU9",
                "selected": true
            }
        ],
        "accountId": "B-M-1YDG7I3"
    },
    {
        "streamId": 2284,
        "streamName": "BeforeFilterTest",
        "streamVersionId": 2,
        "streamTypeId": 1,
        "createdBy": "amoraj",
        "createdDate": "14-11-2019 08:34:43 UTC",
        "sampleRate": 100,
        "timeFrame": null,
        "currentVersionId": 2,
        "archived": "N",
        "activationStatus": "DEACTIVATED",
        "tapiocaStatus": "DONE",
        "scStatus": "DONE",
        "failedConnectors": [],
        "groupId": 92728,
        "groupName": "Performance Analytics-M-1YDFEU9",
        "contractId": "M-1YDFEU9",
        "arlInfos": [
            {
                "arlId": 554837,
                "propertyName": "ds-sqa-od",
                "status": "DONE",
                "accountId": "B-M-1YDG7I3",
                "contractId": "M-1YDFEU9",
                "selected": true
            }
        ],
        "accountId": "B-M-1YDG7I3"
    }];
class App extends React.Component {

    constructor() {
        super();
        this.state = {}
    }


    componentDidMount() {
        this.injectBotPressScript();
        setTimeout(()=> {
            this.initBotPress();
        }, 800)
    }

    injectBotPressScript() {
        const script = document.createElement("script");

        script.src = `${configs.BOTPRESS}/assets/modules/channel-web/inject.js`;
        document.body.appendChild(script);

    }

    initBotPress() {
        window.botpressWebChat.init({
            host: configs.BOTPRESS, botId: configs.BOTID, backgroundColor: '#ffffff', // Color of the background
            textColorOnBackground: '#666666', // Color of the text on the background
            foregroundColor: '#0176ff', // Element background color (header, composer, button..)
            textColorOnForeground: '#FF9933',
            hideWidget: true,
            extraStylesheet: 'assets/modules/customcss/style.css'
        })

        window.setTimeout(function () {
            window.botpressWebChat.mergeConfig({
                containerWidth: '100%',
                layoutWidth: '100%'
            })
            window.botpressWebChat.sendEvent({ type: 'show' })
            window.botpressWebChat.sendEvent({ 
                type: 'proactive-trigger', 
                platform: 'web', 
                text: `Hi, I'm Convexa, your conversational API assistant. How can I help you?` 
              })
        }, 1000)
    }


    render() {
        return (
            <div>
                {/*<JsonToTable json={myJSON} />*/}
              <div id="chatbot">
                    
        </div>
            </div>

        )
    }
}

export default App;