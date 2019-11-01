import Vue from 'vue'
import Vuex from 'vuex';
import axios from "axios";
import OT from "@opentok/client";

Vue.use(Vuex);

import * as types from "../state/mutations";

const openTokServerUrl = process.env.VUE_APP_OPENTOK_URL
const apiKey = process.env.VUE_APP_API_KEY;

export default new Vuex.Store({
    state: {
        isConnecting: true,
        sessionId: null,
        token: null,
        userName: null,
        sessions: [],
        streams: [],
        session: null
    },
    getters: {
        currentSession: state => {
            return state.sessions.find(session => session.sessionId === this.sessionId);
        }
    },
    mutations: {
        initialize(state, sessions) {
            state.sessions = sessions;
        },
        connecting(state, connecting) {
            state.isConnecting = connecting;
        },
        sessionJoined(state, sessionId, token, session) {
            state.token = token;
            state.sessionId = sessionId;
            state.session = session;
            state.isConnecting = false;
        },
        streamCreated(state, stream) {
            state.streams.push(stream);
        },
        streamDestroyed(state, stream) {
            const idx = state.streams.indexOf(stream);
            if (idx > -1) {
                state.streams.splice(idx, 1);
            }
        }
    },
    actions: {
        async init(context) {
            const url = `${openTokServerUrl}/GetSessions`;
            let sessions = [];

            try {
                const response = await axios.get(
                    url,
                    {
                        "Content-Type": "application/json"
                    }
                );
                sessions = response.data;
            }
            catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            }

            context.commit('initialize', sessions);
        },
        async joinSession(context, sessionId) {

            context.commit('connecting', true);

            const url = `${openTokServerUrl}/GetToken`;
            let userToken = null;
            try {

                let successfulConnection = true;

                const response = await axios.post(
                    url,
                    {
                        sessionId: sessionId,
                        userName: this.userName
                    },
                    {
                        "Content-Type": "application/json"
                    }
                );
                userToken = response.data.token;

                const newSession = OT.initSession(apiKey, sessionId);
                newSession.connect(userToken, err => {
                    if (err) {
                        successfulConnection = false;
                        alert(err);
                    }
                });
                newSession.on("streamCreated", event => {
                    this.$store.dispatch(types.STREAM_CREATED, event.stream);
                });
                newSession.on("streamDestroyed", event => {
                    this.$store.dispatch(types.STREAM_DESTROYED, event.stream);
                });

                if (successfulConnection) {
                    context.commit('sessionJoined', sessionId, userToken, newSession);
                } else {
                    context.commit('connecting', false);
                }
            }
            catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
                context.commit('connecting', false);
            }
        },
        createStream(context, stream) {
            context.commit('streamCreated', stream);
        },
        destroyStream(context, stream) {
            context.commit('streamDestroyed', stream);
        }
    }
});