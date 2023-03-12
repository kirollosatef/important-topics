const logOne = async () => {
  setTimeout(() => {
    console.log("one");
  }, 1000);
};

const logTwo = async () => {
  setTimeout(() => {
    console.log("two");
  }, 1000);
};

const logThree = async () => {
  setTimeout(() => {
    console.log("three");
  }, 1000);
};

const logAll = async () => {
  await logOne();
  await logTwo();
  await logThree();
};

logAll();
/**
 * Frontend vs backend
 * What is a server?
 * Backend programming language
 * Backend framework
 * Package manager
 * Database
 * Request response cycle
 * API
 * REST API
 * Cloud computing and IaaS (Infrastructure as a Service)
 * VMs and Load Balancers
 * PaaS (Platform as a Service)
 * Microservices
 * SaaS (Software as a Service)
 * Additional technologies
 * Backend review
 * */
