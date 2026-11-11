import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback story generator for offline / fallback mode
function getFallbackStory(params: {
  theme?: string;
  protagonist?: string;
  moral?: string;
  setting?: string;
  tone?: string;
  userPrompt?: string;
}) {
  const hero = params.protagonist || 'الرحالة زياد';
  const place = params.setting || 'واحة النخيل العتيقة';
  const lesson = params.moral || 'الصبر وحسن التوكل هما مفتاح كل خير';
  const title = `أسرار ${place}: حكاية ${hero}`;

  return {
    title,
    summary: `رحلة استثنائية يخوضها ${hero} في أرجاء ${place}، متعلماً من مصاعب الطريق أن ${lesson}.`,
    genre: params.theme || 'حكمة ومغامرة',
    setting: place,
    characters: [
      { name: hero, role: 'البطل الساعي لطلب الحكمة والخير' },
      { name: 'الشيخ منصور', role: 'حكيم الواحة وصاحب السراج' },
      { name: 'التاجر برهان', role: 'رفيق الدرب الأمين' },
    ],
    chapters: [
      {
        number: 1,
        title: 'الفصل الأول: نداء الأفق البعيد',
        content: `في ظلال ${place}، حيث كانت الشمس تميل نحو الغروب راسمةً لوحات من ذهب فوق الكثبان، وقف ${hero} يتأمل نقوشاً قديمة على حجر البئر. كانت القلوب في تلك الناحية تردد دائماً أن سر السعادة لا يكمن في كثرة المتاع، بل في صفاء النية وعون المحتاجين. عقد ${hero} العزم على بدء رحلة لاكتشاف معنى البذل، متسلحاً بعزيمة لا تلين.`,
      },
      {
        number: 2,
        title: 'الفصل الثاني: اختبار الأمانة في المحنة',
        content: `بينما كانت القافلة تشق طريقها الصخري، هبت عاصفة غير متوقعة حجبت معالم الطريق. وفي وسط الهلع، وجد ${hero} صرة مفقودة تحوي ذخائر وأمانات تاجر مسن كان قد تقطعت به السبل. تردد صدى الطمع للحظة، لكن صوت الضمير الحي وتذكر أن ${lesson} جعله يحافظ عليها ويسعى جاهداً حتى ردها لصاحبها دون نقصان، وسط دهشة القوم وإكبارهم لنبله.`,
      },
      {
        number: 3,
        title: 'الفصل الثالث: جني ثمار الصدق والفضيلة',
        content: `حين انجابت العاصفة وبلغ الركب مشارف المدينة المعمورة، كوفئ ${hero} بحسن السيرة والذكر الطيب الذي ملأ الآفاق، وتفتح في قلبه ينبوع من الطمأنينة لا ينضب. أدرك الجميع في تلك الليلة المباركة أن الكنز الحقيقي هو الأثر الصالح الذي يتركه الإنسان خلفه في دروب الحياة.`,
      },
    ],
    moralLessons: [
      lesson,
      'الأمانة حصن منيع وشرف يعلو بصاحبه فوق مغريات الزمان الزائلة.',
      'العثرات والشدائد هي المحك الحقيقي الذي يصقل معادن الرجال الصادقين.',
    ],
    quote: '«ما طاب عيش المرء إلا بصدقه، وما علا شأنه إلا بما بذل في خفاء.»',
    choices: [
      {
        id: 'choice_1',
        label: 'مواصلة الرحلة نحو جبال الشرق ومساعدة قرية معزولة',
        consequenceHint: 'تختبر حكمتك في قيادة ركب جديد في التضاريس الوعرة',
      },
      {
        id: 'choice_2',
        label: 'الاستقرار في الواحة وتأسيس دار لتعليم الصغار فنون الحكمة والأمانة',
        consequenceHint: 'تغرس بذور الخير في الأجيال وتخلد ذكرك في سجل المدينة',
      },
    ],
  };
}

// Endpoint: Generate a rich structured Arabic story
app.post('/api/story/generate', async (req, res) => {
  try {
    const {
      theme = 'حكمة وتراث',
      protagonist = 'شاب طموح',
      moral = 'الصدق والأمانة',
      setting = 'مدينة تاريخية عتيقة',
      tone = 'أدبي بليغ ومشوق',
      userPrompt = '',
      targetLength = 'medium',
    } = req.body;

    if (!ai) {
      const fallback = getFallbackStory({ theme, protagonist, moral, setting, tone, userPrompt });
      return res.json({ story: fallback, isAiGenerated: false });
    }

    const systemInstruction = `أنت راوٍ وأديب عربي مخضرم، تكتب باللغة العربية الفصحى الراقية الغنية بالبيان والبلاغة والتشويق، خالية من الحشو والركاكة.
مهمتك هي كتابة قصة عربية متكاملة بناءً على عناصر المستخدم، بحيث تتضمن حوارات عميقة، ومشاهداً حية، وعِبراً وأخلاقاً سامية تفيد القارئ وتثير خياله.
يجب إخراج الرد بدقة بصيغة JSON وفق المخطط المطلوب فقط.`;

    const prompt = `اكتب قصة عربية متقنة وممتعة جداً بالعناصر التالية:
- الموضوع والنمط العام: ${theme}
- البطل الرئيسي: ${protagonist}
- العبرة الأخلاقية والهدف: ${moral}
- الزمان والمكان (البيئة): ${setting}
- النبرة والأسلوب: ${tone}
${userPrompt ? `- تفاصيل وإضافات خاصة من الكاتب: ${userPrompt}` : ''}

اجعل القصة تتكون من 3 إلى 4 فصول مترابطة ومشوقة جداً، مع ذكر الشخصيات، ملخص، العبر المستفادة، اقتباس بليغ، وخيارين تفاعليين للقارئ لتكملة مسار القصة لو رغب في التفاعل.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'عنوان القصة باللغة العربية الفصيحة' },
            summary: { type: Type.STRING, description: 'ملخص موجز ومثير للاهتمام' },
            genre: { type: Type.STRING, description: 'تصنيف القصة' },
            setting: { type: Type.STRING, description: 'وصف البيئة والزمان' },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                },
                required: ['name', 'role'],
              },
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ['number', 'title', 'content'],
              },
            },
            moralLessons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'العبر والدروس الأخلاقية المستفادة',
            },
            quote: { type: Type.STRING, description: 'اقتباس أدبي أو حكمة بليغة مستخلصة' },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  consequenceHint: { type: Type.STRING },
                },
                required: ['id', 'label', 'consequenceHint'],
              },
            },
          },
          required: ['title', 'summary', 'genre', 'characters', 'chapters', 'moralLessons', 'quote'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('لم يتم استلام نص من النموذج');
    }

    const story = JSON.parse(text);
    return res.json({ story, isAiGenerated: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/story/generate:', errorMsg);
    const fallback = getFallbackStory(req.body);
    return res.json({ story: fallback, isAiGenerated: false, note: 'تم توليد القصة عبر نظام السرد الاحتياطي' });
  }
});

// Endpoint: Continue the story given an interactive choice
app.post('/api/story/continue', async (req, res) => {
  try {
    const { storyTitle, previousSummary, choiceLabel, characters } = req.body;

    if (!ai) {
      return res.json({
        nextChapter: {
          number: 4,
          title: `الفصل التالي: درب ${choiceLabel}`,
          content: `عقب اختيار المسار: "${choiceLabel}"، أخذت مجريات الأحداث منحنى جديداً مليئاً بالترقب. أثبت الأبطال أن العزم وحسن التوكل هما البوصلة الحقيقية في كل مفترق طرق، وتوالت الأحداث لتختم الرحلة بأسمى معاني النبل والوفاء.`,
        },
        resolution: 'تمت الرحلة بفضل الإصرار والأمانة، وخلدت القصة درساً نفيساً في ذاكرة الأجيال.',
      });
    }

    const prompt = `القصة السابقة بعنوان "${storyTitle}".
ملخص ما سبق: ${previousSummary}
الشخصيات: ${JSON.stringify(characters || [])}
اختار القارئ المسار التالي: "${choiceLabel}".
اكتب فصلاً جديداً ومثيراً (الفصل اللاحق) باللغة العربية الفصيحة المشوقة يطور هذا الاختيار ويقدم خاتمة وحكمة عميقة تلخص هذه المغامرة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'أنت راوٍ بليغ، أخرج فصلاً ختامياً مؤثراً بصيغة JSON وفق المخطط المطلوب.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextChapter: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
              },
              required: ['number', 'title', 'content'],
            },
            resolution: { type: Type.STRING, description: 'خاتمة الحكاية والعبرة النهائية' },
          },
          required: ['nextChapter', 'resolution'],
        },
      },
    });

    const text = response.text;
    const result = JSON.parse(text || '{}');
    return res.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/story/continue:', errorMsg);
    return res.json({
      nextChapter: {
        number: 4,
        title: `الفصل التالي: تجليات المسار المختار`,
        content: `مضى الركب على هدى الاختيار، فتبدت لهم دروب لم تكن في الحسبان. ورغم وعورة المسالك، فإن التمسك بالقيم أثمر سلاماً وأماناً، واجتمع القوم على مائدة الشكر والعرفان بما تحقق من خير.`,
      },
      resolution: 'انتهت الرحلة بثبات المبادئ ونيل المراد.',
    });
  }
});

// Endpoint: Generate a quick interactive quiz for any story to test understanding
app.post('/api/story/quiz', async (req, res) => {
  try {
    const { storyTitle, storyContent } = req.body;

    if (!ai) {
      return res.json({
        quiz: [
          {
            id: 1,
            question: `ما هي العبرة الأساسية المستفادة من قصة "${storyTitle}"؟`,
            options: ['الصبر وحسن الظن والثبات على الحق', 'التسرع في اتخاذ القرارات', 'البحث عن الشهرة والجاه فقط', 'الانعزال وترك مساعدة الآخرين'],
            correctIndex: 0,
            explanation: 'الصبر والثبات على المبادئ هما ركيزة الفضائل وأساس الظفر في كل حكاية ذات مغزى.',
          },
          {
            id: 2,
            question: 'كيف تعامل بطل الحكاية مع الاختبار أو التحدي الذي واجهه؟',
            options: ['بالاستسلام للأمر الواقع', 'بالحكمة والتمسك بالأمانة وحسن النية', 'باللجوء إلى الحيلة غير النزيهة', 'بإلقاء اللوم على رفقائه'],
            correctIndex: 1,
            explanation: 'الحكمة وحسن الخلق يفتحان أبواب الفرج ويدفعان المصاعب مهما اشتدت.',
          },
        ],
      });
    }

    const prompt = `اصنع اختباراً تفاعلياً قصيراً وممتعاً مكوناً من سؤالين إلى ثلاثة أسئلة اختيار من متعدد لفهم واستيعاب قصة "${storyTitle}".
مضمون القصة أو ملخصها:
${typeof storyContent === 'string' ? storyContent.slice(0, 2000) : JSON.stringify(storyContent).slice(0, 2000)}

لكل سؤال: نص السؤال، 4 خيارات، رقم الخيار الصحيح (0-3)، وتفسير مبسط للعبرة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'أنت معلم وأديب حكيم، تصيغ أسئلة استيعاب شيقة بصيغة JSON وفق المخطط.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['quiz'],
        },
      },
    });

    const result = JSON.parse(response.text || '{"quiz": []}');
    return res.json(result);
  } catch (err) {
    console.error('Error generating quiz:', err);
    return res.json({ quiz: [] });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
