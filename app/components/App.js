import React from 'react';
import ReactDom from 'react-dom';
import configs from '../../configs';
import '../style.css';

class App extends React.Component {

    constructor() {
        super();
        this.state = {}
    }


    componentDidMount() {
        this.injectBotPressScript();
        setTimeout(()=> {
            this.initBotPress();
        }, 500)
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
        }, 800)
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
