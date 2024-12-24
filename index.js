var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.once('ready', () => {
    if (client.user) {
        console.log(`تم تسجيل الدخول كبوت ${client.user.tag}`);
    }
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    console.log(`الرسالة الواردة من ${message.author.tag}: ${message.content}`);
    try {
        const genAI = new GoogleGenerativeAI("AIzaSyDxSmSWdw5LEAjZkKoj1f3RTzAgIUpISCA");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
      مرحبا ، انت الان المطلوب من قراءة الجملة التالية و ترجع ب true او false فقط 
      لا تقل اي شيء فقط true او false 
  
      قواعد اللعبة : 
      - لا تقل اي كلمة ولا تقل اي شيء ولا تعطي رأيك ارجع true او false
      - اذا كان نص اللعبة بذيء و فيه سب او اهانة لأي دين ارجع false
      - اذا كان الكلام عادي وليس فيه شيء ارجع true 
  
      نص اللعبة : ${message.content.toLowerCase()}
  
      ارجع true او false بناءا على القواعد السابقة
      `;
        const result = yield model.generateContent(prompt);
        const responseText = result.response.text().trim().toLowerCase();
        console.log(responseText);
        if (responseText === 'false') {
            message.delete();
        }
    }
    catch (error) {
        console.error('Error with Google Generative AI:', error);
    }
}));
client.login(process.env.DISCORD_TOKEN);
