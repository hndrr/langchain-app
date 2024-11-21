import { initLlama, loadLlamaModelInfo } from 'llama.rn';
import "web-streams-polyfill/dist/polyfill.min.js";

const modelPath = 'file:///Users/osamuhonda/workspace/langchain-app/model/gemma-2-baku-2b-it-Q4_K_M.gguf';
let context: any;

// Initialize Llama context
const initializeLlama = async () => {
  try {
    const modelInfo = await loadLlamaModelInfo(modelPath);
    context = await initLlama({
      model: modelPath,
      use_mlock: true,
      n_ctx: 2048,
      n_gpu_layers: 1, // Enable GPU layers
    });
    console.log('Llama initialized successfully');
  } catch (error) {
    console.error('Error initializing Llama:', error);
  }
};

// Call initialization on module load
initializeLlama();

const stopWords = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '<|EOT|>',
  '<|END_OF_TURN_TOKEN|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
];

export const postChatMessage = async (text: string): Promise<string> => {
  if (!context) {
    throw new Error('Llama context is not initialized');
  }

  try {
    const msgResult = await context.completion(
      {
        messages: [
          {
            role: 'system',
            content: 'This is a conversation between user and AI assistant.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        n_predict: 100,
        stop: stopWords,
      },
      (data) => {
        // Optionally handle partial completions here
        const { token } = data;
        console.log('Partial token:', token);
      }
    );

    return msgResult?.text || 'No response';
  } catch (error) {
    console.error('Error in postChatMessage:', error);
    throw error;
  }
};
