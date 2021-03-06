import ButtonLink from '../components/ButtonLink';

function Landing() {
  return (
    <div className="flex flex-col justify-center items-center space-y-8 w-full min-h-full">
      <h1 className="w-2/3 text-4xl font-bold text-center text-gray-800 drop-shadow-2xl xl:text-6xl 2xl:text-9xl">
        Play Hand Brain Chess With Friends!
      </h1>
      <div className="flex flex-row space-x-8">
        <ButtonLink toLink="/auth/login">Log In</ButtonLink>
        <ButtonLink toLink="/auth/signup">Sign Up</ButtonLink>
      </div>
    </div>
  );
}

export default Landing;
