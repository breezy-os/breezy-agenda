

// ==================
// Session Management
// ------------------

import type { AgendaItem } from "./AgendaState";

export async function checkSession() {
  const response = await fetch('/api/session', {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status !== 200) {
    throw new Error("Failed to check session.");
  }
  return response.json();
}

export async function logIn(username: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (response.status !== 200) {
    throw new Error("Failed to log in.");
  }
  return response.json();
}

export async function logOut() {
  const response = await fetch('/api/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status !== 200) {
    throw new Error("Failed to log out.");
  }
}

export async function createAccount(username: string, password: string) {
  const response = await fetch('/api/create-account', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (response.status !== 200) {
    throw new Error("Failed to log in.");
  }
}


// ===============
// Data Management
// ---------------

export async function putItem(item: AgendaItem) {
  const response = await fetch('/api/item', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (response.status !== 200) {
    throw new Error("Failed to put item.");
  }
}

export async function deleteItem(itemId: string) {
  const response = await fetch('/api/item', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  });
  if (response.status !== 200) {
    throw new Error("Failed to delete item.");
  }
}