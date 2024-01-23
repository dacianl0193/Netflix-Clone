import axios from "axios";
import config from "../../config.json";

interface ReCaptchaOptions {
    secret: string;
}

interface CreateAssessmentOptions {
    token: string;
}

interface Assessment {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    score: number;
    action: string;
}

export class ReCaptcha {

    private readonly secret: string;

    constructor({ secret }: ReCaptchaOptions) {
        this.secret = secret;
    }

    public createAssessment = async ({ token }: CreateAssessmentOptions) => {
        const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
                secret: this.secret,
                response: token
            }
        })
        .catch((error) => error.response);

        console.log(response.data);

        const assessment: Assessment = response.data;
    
        return assessment;
    }
}