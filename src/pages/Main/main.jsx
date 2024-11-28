import Hero from "../../components/Main/Hero";
import Testimonials from "../../components/Main/Testimonials";
import FQA from "../../components/Main/FQA";
import CountUp from "react-countup";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect, useRef } from "react";

const codeExample = `
import os
from syntropix import Syntropix

api_key = os.environ.get('SYNCTROPIX_API_KEY')
client = Syntropix(api_key=api_key)
response = client.completions.create(
    model="llama3-8b",
    prompt="",
    max_tokens=1024,
    temperature=0.0,
    top_p=1.0,
    top_k=10,
    repetition_penalty=0.6,
)
print(response.choices[0].text)`;

const TypewriterCode = ({ code, speed = 50 }) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const codeRef = useRef(null);

  // 监听元素是否进入视图
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (codeRef.current) {
      observer.observe(codeRef.current);
    }

    return () => {
      if (codeRef.current) {
        observer.unobserve(codeRef.current);
      }
    };
  }, []);

  // 只有在元素可见时才开始打字效果
  useEffect(() => {
    if (!isVisible) return;

    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, code, speed, isVisible]);

  return (
    <div
      ref={codeRef}
      style={{
        backgroundColor: "#1E1E1E",
        borderRadius: "0.5rem",
      }}
    >
      <SyntaxHighlighter
        language="python"
        style={vs2015}
        customStyle={{
          background: "transparent",
          padding: "1.5rem",
          margin: 0,
          minWidth: "500px",
        }}
      >
        {displayedCode}
        {currentIndex < code.length && "|"}
      </SyntaxHighlighter>
    </div>
  );
};

const Main = () => {
  return (
    <>
      <Hero />

      <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div class="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div class="lg:col-span-1" data-aos="fade-right">
            <h2 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200 text-left">
              We tackle the challenges start-ups face
            </h2>
            <p class="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500 text-left">
              We deliver comprehensive, high-quality, and cost-efficient AI
              services to streamline your workflow and enhance your outcomes.
              Our platform offers end-to-end solutions that cover every aspect
              of the AI lifecycle。{" "}
            </p>
          </div>

          <div class="lg:col-span-2">
            <div class="grid sm:grid-cols-2 gap-8 md:gap-12">
              <div class="flex gap-x-5" data-aos="fade-up">
                <svg
                  class="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="18" height="10" x="3" y="11" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" x2="8" y1="16" y2="16" />
                  <line x1="16" x2="16" y1="16" y2="16" />
                </svg>
                <div class="grow">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-left">
                    Model Hosting & Training
                  </h3>
                  <p class="mt-1 text-gray-600 dark:text-neutral-400 text-left">
                    Seamlessly manage and train your AI models with our
                    optimized infrastructure.
                  </p>
                </div>
              </div>

              <div class="flex gap-x-5" data-aos="fade-up" data-aos-delay="300">
                <svg
                  class="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <div class="grow">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-left">
                    Agent Development & Integration
                  </h3>
                  <p class="mt-1 text-gray-600 dark:text-neutral-400 text-left">
                    Build intelligent agents and integrate them effortlessly
                    into your ecosystem.
                  </p>
                </div>
              </div>

              <div
                class="flex gap-x-5"
                data-aos="fade-left"
                data-aos-delay="600"
              >
                <svg
                  class="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <div class="grow">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-left">
                    Application Deployment & Evaluation
                  </h3>
                  <p class="mt-1 text-gray-600 dark:text-neutral-400 text-left">
                    Deploy applications with ease and gain valuable insights
                    through robust evaluation tools.
                  </p>
                </div>
              </div>

              <div
                class="flex gap-x-5"
                data-aos="fade-left"
                data-aos-delay="900"
              >
                <svg
                  class="shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <div class="grow">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-left">
                    Data Generation & Automation
                  </h3>
                  <p class="mt-1 text-gray-600 dark:text-neutral-400 text-left">
                    Leverage cutting-edge techniques for efficient data
                    generation and automatic optimization your services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-aos-anchor-placement="top-center"
        className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
      >
        <div className="grid items-center lg:grid-cols-12 gap-6 lg:gap-12">
          <div className="lg:col-span-4" data-aos="zoom-in">
            <div className="lg:pe-6 xl:pe-12">
              <p className="text-6xl font-bold leading-10 text-blue-600">
                <CountUp
                  end={3.2}
                  suffix="x Faster"
                  decimals={1}
                  enableScrollSpy
                />
                <span className="ms-1 inline-flex items-center gap-x-1 bg-gray-200 font-medium text-gray-800 text-xs leading-4 rounded-full py-0.5 px-2 dark:bg-neutral-800 dark:text-neutral-300">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                  </svg>
                  +0.1 this month
                </span>
              </p>
              <p className="mt-2 sm:mt-3 text-gray-500 dark:text-neutral-500">
                SPEED RELATIVE TO VLLM
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 relative lg:before:absolute lg:before:top-0 lg:before:-start-12 lg:before:w-px lg:before:h-full lg:before:bg-gray-200 lg:before:dark:bg-neutral-700">
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-3 sm:gap-8">
              <div data-aos="zoom-in" data-aos-delay="200">
                <h4 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Service stability
                </h4>
                <p className="text-3xl font-semibold text-blue-600">
                  <CountUp
                    end={99.95}
                    suffix="%"
                    decimals={2}
                    enableScrollSpy
                  />
                </p>
                <p className="mt-1 text-gray-500 dark:text-neutral-500"></p>
              </div>

              <div data-aos="zoom-in" data-aos-delay="400">
                <p className="text-3xl font-semibold text-blue-600">
                  <CountUp end={200} suffix="+" enableScrollSpy delay={400} />
                </p>
                <p className="mt-1 text-gray-500 dark:text-neutral-500">
                  build-in agent tools
                </p>
              </div>

              <div data-aos="zoom-in" data-aos-delay="600">
                <p className="text-3xl font-semibold text-blue-600">
                  <CountUp end={11} suffix="x" enableScrollSpy delay={600} />
                </p>
                <p className="mt-1 text-gray-500 dark:text-neutral-500">
                  lower cost relative to GPT-4o
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
          <div
            data-aos="fade-right"
            className="w-full overflow-x-auto text-left"
          >
            <TypewriterCode code={codeExample} speed={5} />
          </div>

          <div className="mt-5 sm:mt-10 lg:mt-0">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2 md:space-y-4" data-aos="fade-left">
                <h2 className="font-bold text-3xl lg:text-4xl text-gray-800 dark:text-neutral-200">
                  Empowering Start-Ups with Tailored AI Solutions
                </h2>
                <p className="text-gray-500 dark:text-neutral-500">
                  Beyond partnering with emerging enterprises on their digital
                  transformation journeys, we’ve developed enterprise-ready
                  solutions to tackle common pain points identified across
                  diverse projects and industries.
                </p>
              </div>

              <ul className="space-y-2 sm:space-y-4">
                <li
                  className="flex gap-x-3"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg
                      className="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div className="grow text-left">
                    <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      <span className="font-bold">
                        Effortless and Rapid AI Implementation
                      </span>{" "}
                      designing
                    </span>
                  </div>
                </li>

                <li
                  className="flex gap-x-3"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg
                      className="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div className="grow text-left">
                    <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      Powerful{" "}
                      <span className="font-bold">
                        Scalable and Robust Features
                      </span>
                    </span>
                  </div>
                </li>

                <li
                  className="flex gap-x-3"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg
                      className="shrink-0 size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div className="grow text-left">
                    <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      Exceptional User Experience
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Testimonials />
      <FQA />
    </>
  );
};

export default Main;
