import React from "react";

const IconNewspaper = ({ color, height, width }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill={`${color}`}
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink"
    >
      <mask
        id="mask0_462_2125"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="22"
        height="22"
      >
        <rect width="22" height="22" fill="url(#pattern0_462_2125)" />
      </mask>
      <g mask="url(#mask0_462_2125)">
        <rect width="22" height="22" fill={`${color}`} />
      </g>
      <defs>
        <pattern
          id="pattern0_462_2125"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_462_2125" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_462_2125"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwElEQVR4nO2cv2sUQRTHnxqMMRDESlALlSBY6R8gFiZpbUxvESuNKfwDLJJCsBOJYjqNomcnGG1sNKKmEC3sbMTeH1wSRKIfWXJg4u1MdvZm5+btzQeuysy89/3e5u27udsRSSQSiUQikUgkEom6AewCpoC3wDLxsQy8AS4B/aIR4ADwAT28z3IWhVeyJpM3mq3nym6VC61MihZaNVkrr0ULQBO9NEULKEe0gHJECyhHtIByRAsoR7SAckQLKEe0gHJECyhHtIB+RkUD6OcPMBv9Th71YSnqPWrqxSdgn8QI9eNd9mWGxAb15JrEBjo5Bty3/H0NOCExgULkX+7TlmGPJCZQiGzO/55h2G/giMQCCpHN+e8FvhuGzkgsoBBp13DVMPQzsF1iAIVIu4bh1ifEPEYkBlCI5OtYNAy/KzGAQiRfx3nD8FVgT3hn2xNUh+TrGAJWDFMmwjvbnqA6xKxl3jDlZVhX85NTh5i1jFqmHQ3rbHty6hCzlu2tli6P6bDOtienDrHrmTFM+wLsCOdse2LqELueOHvqirxYA+4AZ4Ax4Bzw3NfiBTSZeur5MK7mJ+WbJnDKEOuyjwAFNE0Ypmbt31AlRhZIyjdTW8Sb6zRAAU3x9dT4v5r7Cphg6gwKUVCXqadelG6AX14UjDlmuWFtScEYI4bpWdxhCQ1+eeUQ93bZIAXXt/XU4fep8csqMFgwbukS4qBtJpp9avwz7hD7dJkS4rB+PD01/mk4xncuIY7rx7FPTTXPbA86xHcuIY76jD21hIRqGHfMwakLcVx7yMc6HUM1NErkUfSDzIIvjRISqmHFpXw4lJBnZX5XZ1pMQkJ1jJfIxdaFlDLZplFCUp3PNErmM+fTZJvGsut5TaIb5cNQQjoyuReMLlU+/ishHZts09jpul6S6Gb52ND/enkupReMXilTPkJpjCIJj5wNKshBYxRJeORhUEEOGqNIok7lg0iMbta9fBCJ0SFOCWsEFRWp0dkRlFXzE9gfVFiERve3TkWs7bN/xGD0hrNJqza7CRzuaaM3XNmT2emIFd4gl4DdPW20T4AHFrOfhjzyAThkyOOHaIf1UmT7r1gIZTZwxZDDR6kDwAWL0UHMBg5aHvaclboA3OyW2a1zsbN7gomTUheAPuDJVmZXFDt7Ezv6jaAqWO9mbKIruftbwv0CjksdAXYCjyMx+qLUGdav7K4bLb0AyehgRn/L8fqr9ljRAdzIEX9de6zoAAaAW61vXVZaffaA9ljRAmzLXnWLlUgkEomE9BJ/AV2Lg+h1Vfx5AAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
};

export default IconNewspaper;
