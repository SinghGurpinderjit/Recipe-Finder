<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth } from "$lib/state/auth.svelte";
    import { toasts } from "$lib/state/toast.svelte";
    import { page } from "$app/state";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    let authorized = $derived(auth.isLoggedIn);

    async function onSubmit(e: Event) {
        e.preventDefault();
        error = "";
        loading = true;
        const result = await auth.login(email, password);
        loading = false;
        if (!result.ok) {
            error = result.error ?? "Login failed.";
            return;
        }
        toasts.show("Logged in successfully", "success");
        goto("/");
    }

    $effect(() => {
        if (authorized) {
            goto("/");
        }
    });
</script>

<svelte:head>
    <title>Log In — Recipe Finder</title>
</svelte:head>

<div class="auth-page">
    <div class="auth-card">
        <h1>Log In</h1>

        <form onsubmit={onSubmit} class="auth-form">
            <label>
                Email
                <input type="email" bind:value={email} required />
            </label>
            <label>
                Password
                <input type="password" bind:value={password} required />
            </label>

            {#if error}<p class="error">{error}</p>{/if}

            <button class="btn" type="submit" disabled={loading}>
                {loading ? "Logging in…" : "Log In"}
            </button>
        </form>

        <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
</div>

<style>
    .auth-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(90vh - 64px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        align-self: center;
    }
    .auth-card {
        top: 0;
        width: 100%;
        max-width: 360px;
        text-align: center;
    }
    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        text-align: left;
    }

    .auth-form label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
    }
    .auth-form input {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
    }
    .error {
        color: #dc2626;
        font-size: 0.85rem;
    }
</style>
