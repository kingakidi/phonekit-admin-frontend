export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to.fullPath);
  if (to.fullPath === "/") {
    return navigateTo("/users", { redirectCode: 301 });
  } else {
    navigateTo("/login");
  }
});
