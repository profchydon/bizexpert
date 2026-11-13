const createQueryString = (name: string, value: string, searchParams?: any) => {
  const params = new URLSearchParams(searchParams?.toString());
  params.set(name, value);

  return params.toString();
};

export default createQueryString;
